# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "typer",
# ]
# ///

import json
import sys
from typing import Annotated

import typer


def update_tasks(
        update_file: Annotated[
            str,
            typer.Argument(
                help="Path to JSON format file with updated task configurations."
            )],
        tasks_file: Annotated[
            str,
            typer.Option("-t", "--tasks-file", help="Path to the tasks.json file", )
        ] = "tasks.json"):
    with open(update_file, 'r') as update_fh, open(tasks_file, 'r') as tasks_fh:
        updated_tasks = json.load(update_fh)
        tasks = json.load(tasks_fh)

        for species, update in updated_tasks.items():
            if species not in tasks["genome"]:
                tasks["genome"][species] = update
                print(f"Adding new tasks to {species}", file=sys.stderr)
            else:
                for update_task in update:
                    for current_task in tasks["genome"][species]:
                        if current_task["task"] == update_task["task"]:
                            current_task["version"] = update_task["version"]
                            print(f"Updated version of {current_task['task']} for {species}/{current_task['task']}",
                                  file=sys.stderr)
                            break
                    else:
                        tasks["genome"][species].append(update_task)
                        print(f"Added new task to {species}/{update_task['task']}", file=sys.stderr)

    print(json.dumps(tasks, indent=4), file=sys.stdout)

if __name__ == "__main__":
    typer.run(update_tasks)
