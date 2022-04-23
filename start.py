import os, threading, time, shutil, argparse


client_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "ClientApp")

server_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "Server")

class Start:
    def __init__(self):
        parser = argparse.ArgumentParser()
        parser.add_argument(
            '--install',
            dest = 'install',
            nargs = '?',
            const = True,
            default = False,
            help = 'Install node modules in both Client and Server.'
        )

        parser.add_argument(
            '--delete',
            dest = 'delete',
            nargs = '?',
            const = True,
            default = False,
            help = 'Delete node modules in both Client and Server.'
        )

        args = parser.parse_args()

        if args.install:
            print("Installing node modules...")
            os.chdir(client_path)
            self.checkNodeModules()

            os.chdir(server_path)
            self.checkNodeModules()

            return



        if args.delete:
            print("Removing ClientApp node modules...")
            shutil.rmtree(client_path + "\\node_modules")
            print("ClientApp node modules removed.\n")

            print("Removing Server node modules...")
            shutil.rmtree(server_path + "\\node_modules")
            print("Server node modules removed.\n")

            return

        print("""
     _____                  _     _ _  _____ _           _
    |  __ \                | |   | (_)/ ____| |         | |
    | |__) |___ _ __  _   _| |__ | |_| |    | |__   __ _| |_
    |  _  // _ \ '_ \| | | | '_ \| | | |    | '_ \ / _` | __|
    | | \ \  __/ |_) | |_| | |_) | | | |____| | | | (_| | |_
    |_|  \_\___| .__/ \__,_|_.__/|_|_|\_____|_| |_|\__,_|\__|
                | |
                |_| Starting App...
        """)

        TD_C = threading.Thread(target=self.startClient, args=())
        TD_C.start()

        time.sleep(1)

        TD_S = threading.Thread(target=self.startServer, args=())
        TD_S.start()



    def checkNodeModules(self):
        node_modules = os.path.exists("node_modules")

        if not node_modules:
            os.system("npm i")



    def startClient(self):
        os.chdir(client_path)

        self.checkNodeModules()

        os.system("ng serve")



    def startServer(self):
        os.chdir(server_path)

        self.checkNodeModules()

        os.system("nodemon start.js")



if __name__ == "__main__":
    Start()