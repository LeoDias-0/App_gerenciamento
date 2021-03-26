from sys import argv
import json


cadastro_PATH = 'dados\\Cadastros\\'

def ler_txt(path_do_txt):
    with open(path_do_txt, 'r') as f:
        output = f.readlines()
    for i in range(len(output)):
        output[i] = output[i].replace('\n', '')
    return output


if __name__ == '__main__':
    nomes = ler_txt(cadastro_PATH + 'Clientes\\nomes.txt')
    placas = ler_txt(cadastro_PATH + 'Placas\\placas.txt')
    materiais = ler_txt(cadastro_PATH + 'Materiais\\materiais.txt')

    print(json.dumps([nomes, placas, materiais], ensure_ascii=False))
    