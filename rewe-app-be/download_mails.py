import argparse
import json
import pathlib
import subprocess
import sys

DATA_DIR = (pathlib.Path(__file__).parent / "data").resolve()
EBON_DIR = DATA_DIR / "ebons"
PARSED_FILES_PATH = DATA_DIR / "parsed_files.json"
EBON_FILE_PATTERN = r"(REWE-eBon.pdf[\.\d]*) \(application/octet-stream\)"


def read_parsed_files():
    if not PARSED_FILES_PATH.exists():
        return []
    with open(PARSED_FILES_PATH) as fd:
        parsed_files = json.load(fd)
    return parsed_files


def write_parsed_files(parsed_files: list):
    with open(PARSED_FILES_PATH, "w") as fd:
        json.dump(parsed_files, fd)


def call_getmail() -> None:
    cmd = "getmail"
    subprocess.call(cmd, shell=True)


def extract_attachments(mail_dir: pathlib.Path) -> None:
    parsed_files = read_parsed_files()
    for file_path in (mail_dir / "new").glob("*.L"):
        if str(file_path) in parsed_files:
            continue
        subprocess.call(
            f"munpack -C {EBON_DIR} {file_path}",
            stderr=subprocess.DEVNULL,
            shell=True,
            text=True,
        )
        parsed_files.append(str(file_path))
    write_parsed_files(parsed_files)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser("Read mails and extract attachments")
    parser.add_argument(
        "mail_dir", type=pathlib.Path, help="Directory to mail folder from getmail"
    )
    args = parser.parse_args()
    if not (args.mail_dir / "new").exists():
        print(f"{args.mail_dir} seems to be an incorrect mail directory")
        sys.exit(-1)
    return args


def main():
    args = parse_args()
    call_getmail()
    extract_attachments(args.mail_dir)


if __name__ == "__main__":
    main()
