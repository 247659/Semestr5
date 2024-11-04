import math
import random


def func1(x, y):
    wynik = (8 * math.exp(-(x + 12) ** 2 - (y + 12) ** 2) + 9 / (1 + (x + 12) ** 2 + (y - 12) ** 2) + 20 /
             (math.cosh(x - 12) ** 2 + math.cosh(y + 12) ** 2)) + 176 / ((math.exp(x - 12) + 2 + math.exp(-x + 12))
                                                                         * (math.exp(y - 12) + 2 + math.exp(-y + 12)))
    return wynik

def func2(x):
    wynik = x * math.sin(10 * math.pi * x) + 1
    return wynik

def example1(t, a, epoki, proby):
    t = t
    a = a
    epoki = epoki
    proby = proby

    x1 = random.uniform(-15, 15)
    y1 = random.uniform(-15, 15)
    f1 = func1(x1, y1)

    for i in range(epoki):
        for j in range(proby):

            x2 = random.uniform(max(-15.0, x1 - 0.04 * t), min(15.0, x1 + 0.04 * t))
            y2 = (random.uniform(max(-15.0, y1 - 0.04 * t), min(15.0, y1 + 0.04 * t)))
            f2 = func1(x2, y2)


            if f1 < f2:
                x1 = x2
                y1 = y2
                f1 = f2
            elif (math.exp((f1 - f2) / t)) > random.uniform(0, 1):
                x1 = x2
                y1 = y2
                f1 = f2
        t *= a

    return (x1, y1, f1)

def example2(t, a, epoki, proby):
    t = t
    a = a
    epoki = epoki
    proby = proby

    x1 = random.uniform(-1, 2)
    f1 = func2(x1)

    for i in range(epoki):
        for j in range(proby):

            x2 = random.uniform(max(-1.0, x1 - 0.2 * t), min(2.0, x1 + 0.2 * t))
            f2 = func2(x2)

            if f1 < f2:
                x1 = x2
                f1 = f2
            elif (math.exp((f1 - f2) / t)) > random.uniform(0, 1):
                x1 = x2
                f1 = f2
        t *= a

    return (x1, f1)

if __name__ == '__main__':
    x, y, f1 = example1(90, 0.999, 200, 3)
    print(f"Ekstemum znalezione w punkcie: ({x:.2f}, {y:.2f}) o wartości {f1}")

    x2, f1_2 = example2(5, 0.997, 1200, 3)
    print(f"Ekstemum znalezione w punkcie x: ({x2:.2f}) o wartości {f1_2}")





