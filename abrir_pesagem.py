from sys import argv
import time



def anotar_pesagem_aberta(dados):
    data = time.strftime(r"%Y,%m,%d,%H,%M,%S")
    t = data.split(',')
    data = [ x for x in t ]
    ano, mes, dia, hora, minuto, seg = data
    path = 'dados\\Pesagens Abertas\\{} {}-{}-{} {}h{}min{}s -{}-.txt'.format(
        dados['pessoa'],
        dia,
        mes,
        ano,
        hora,
        minuto,
        seg,
        dados['numero']
    )
    with open(path, 'w') as f:
        text = [str(dados[key]) + '\n' for key in dados.keys()]
        f.writelines(text)


if __name__ == '__main__':
    if len(argv) < 6:
        argv += [0 for i in range(5-len(argv))]
    dados = {
        'placa': argv[1],
        'pessoa': argv[2],
        'material': argv[3],
        'peso': argv[4],
        'numero': argv[5]
    }
    anotar_pesagem_aberta(dados)
    