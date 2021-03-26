from sys import argv
import json


if __name__ == '__main__':
    temp = {
        'numero_de_pesagens': int(argv[1])
    }
    with open('variables\\variaveis.json', 'w') as f:
        json.dump(temp, f)
