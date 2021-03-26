from sys import argv
import os, time


def pegar_dados_e_apagar_pesagem_aberta(numero_da_pesagem):
    for file in os.listdir('dados\\Pesagens Abertas'):
        if file.endswith(str(numero_da_pesagem) + '-.txt'):
            with open(os.path.join('dados\\Pesagens Abertas', file), 'r') as f:
                output = f.readlines()
                keys_dict = ['placa', 'pessoa', 'material', 'peso', 'numero']
                output = {key: line[:-1] for key, line in zip(keys_dict, output)}
            os.remove(os.path.join('dados\\Pesagens Abertas', file))
            return output
    return {}


def anotar_como_pesagem_fechada(dados_ticket_abertura, dados_ticket_fechamento):
    data = time.strftime(r"%Y,%m,%d,%H,%M,%S")
    t = data.split(',')
    data = [ x for x in t ]
    ano, mes, dia, hora, minuto, seg = data
    path_pesagem_fechada = 'dados\\Pesagens Fechadas\\{} {}-{}-{} {}h{}min{}s -{}-.txt'.format(
        dados_ticket_fechamento['pessoa'],
        dia,
        mes,
        ano,
        hora,
        minuto,
        seg,
        dados_ticket_fechamento['numero']
    )

    with open(path_pesagem_fechada, 'w') as f:
        text = [str(dados_ticket_abertura[key]) + '\n' for key in dados_ticket_abertura.keys()]
        text = text + [str(dados_ticket_fechamento[key]) + '\n' for key in dados_ticket_fechamento.keys()]
        f.writelines(text)
    # print('Abertura: ', dados_ticket_abertura, '\nFechamento: ', dados_ticket_fechamento)




if __name__ == '__main__':
    if len(argv) < 6:
        argv += [0 for i in range(6-len(argv))]
    dados_fechamento = {
        'placa': argv[1],
        'pessoa': argv[2],
        'material': argv[3],
        'peso': argv[4],
        'numero': argv[5]
    }

    id_pesagem = dados_fechamento['numero']


    dados_abertura = pegar_dados_e_apagar_pesagem_aberta(id_pesagem)

    anotar_como_pesagem_fechada(dados_abertura, dados_fechamento)