from sys import argv
import json



if __name__ == '__main__':
    with open('variables\\variaveis.json', 'r') as f:
        variaveis = json.load(f)
    print(json.dumps([variaveis], ensure_ascii=False))
    