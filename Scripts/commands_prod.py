import requests, argparse

parser = argparse.ArgumentParser()

exclusive = parser.add_mutually_exclusive_group()

exclusive.add_argument(
    '--update',
    dest = 'update',
    nargs = '?',
    const = True,
    default = False,
    help = 'Update prod RepubliChat.'
)

exclusive.add_argument(
    '--stop',
    dest = 'stop',
    nargs = '?',
    const = True,
    default = False,
    help = 'Stop prod RepubliChat.'
)

exclusive.add_argument(
    '--start',
    dest = 'start',
    nargs = '?',
    const = True,
    default = False,
    help = 'Start prod RepubliChat.'
)

args = parser.parse_args()

if args.update:
    print("Updating RepubliChat...")

    update_rqst = requests.post('https://commands.jasoc.duckdns.org/command', json = { 'command': 'republi-chat' })

    print(update_rqst)

if args.start:
    print("Starting RepubliChat...")

    start_rqst = requests.post('https://commands.jasoc.duckdns.org/command', json = { 'command': 'start-republi-chat' })

    print(start_rqst)

if args.stop:
    print("Arresting RepubliChat...")

    stop_rqst = requests.post('https://commands.jasoc.duckdns.org/command', json = { 'command': 'stop-republi-chat' })

    print(stop_rqst)






