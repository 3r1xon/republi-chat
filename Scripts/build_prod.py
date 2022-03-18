import os
import sys


CLIENT_FOLDER = 'ClientApp'


def main():

    run_dir = os.getcwd()
    curr_dir = os.path.dirname(os.path.realpath(__file__))
    full_client_dir = os.path.join(curr_dir, '..', CLIENT_FOLDER)

    os.chdir(full_client_dir)
    os.system('npm run ng build')
    os.chdir(run_dir)

    if len(sys.argv) != 1:
        dest = sys.argv[1]
        print(f'Copying assets to folder {dest}')

        os.system(f"rm -rf {os.path.join(dest, '*')}")
        os.system(f'cp -R {full_client_dir}/dist/RepubliChat/* {dest}')


if __name__ == "__main__":
    main()
