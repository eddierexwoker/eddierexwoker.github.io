"""Local preview server with HTTP byte-range support for seekable MP4 video."""

from __future__ import annotations

import argparse
import os
import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class RangeRequestHandler(SimpleHTTPRequestHandler):
    range: tuple[int, int] | None = None

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        try:
            source = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        try:
            stat = os.fstat(source.fileno())
            size = stat.st_size
            content_type = self.guess_type(path)
            requested = self.headers.get("Range")
            match = re.fullmatch(r"bytes=(\d*)-(\d*)", requested or "")

            self.range = None
            if match:
                first, last = match.groups()
                if first:
                    start = int(first)
                    end = int(last) if last else size - 1
                else:
                    suffix = int(last)
                    start = max(0, size - suffix)
                    end = size - 1

                if start >= size or start > end:
                    self.send_response(416)
                    self.send_header("Content-Range", f"bytes */{size}")
                    self.end_headers()
                    source.close()
                    return None

                end = min(end, size - 1)
                self.range = (start, end)
                self.send_response(206)
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("Content-Length", str(end - start + 1))
                source.seek(start)
            else:
                self.send_response(200)
                self.send_header("Content-Length", str(size))

            self.send_header("Content-Type", content_type)
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Last-Modified", self.date_time_string(stat.st_mtime))
            self.end_headers()
            return source
        except Exception:
            source.close()
            raise

    def copyfile(self, source, outputfile):
        if self.range is None:
            return super().copyfile(source, outputfile)

        remaining = self.range[1] - self.range[0] + 1
        while remaining:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    handler = partial(RangeRequestHandler, directory=str(root))
    server = ThreadingHTTPServer(("0.0.0.0", args.port), handler)
    print(f"Portfolio: http://127.0.0.1:{args.port}/")
    server.serve_forever()


if __name__ == "__main__":
    main()
