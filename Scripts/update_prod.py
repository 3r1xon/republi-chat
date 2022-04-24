import requests

print("""
  _    _           _       _   _                   
 | |  | |         | |     | | (_)                  
 | |  | |_ __   __| | __ _| |_ _ _ __   __ _       
 | |  | | '_ \ / _` |/ _` | __| | '_ \ / _` |      
 | |__| | |_) | (_| | (_| | |_| | | | | (_| |_ _ _ 
  \____/| .__/ \__,_|\__,_|\__|_|_| |_|\__, (_|_|_)
        | |                             __/ |      
        |_|                            |___/       
""")

update_rqst = requests.post('https://commands.jasoc.duckdns.org/command', json = { 'command': 'republi-chat' })

print(update_rqst)