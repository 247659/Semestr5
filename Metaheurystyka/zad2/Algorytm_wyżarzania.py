import math
import random


def func1(x, y):
    wynik = (8 * math.exp(-(x + 12) ** 2 - (y + 12) ** 2) + 9 / (1 + (x + 12) ** 2 + (y - 12) ** 2) + 20 /
             (math.cosh(x - 12) ** 2 + math.cosh(y + 12) ** 2)) + 176 / ((math.exp(x - 12) + 2 + math.exp(-x + 12))
                                                                         * (math.exp(y - 12) + 2 + math.exp(-y + 12)))
    return wynik


def example1(t, a, epoki, proby):
    t = t
    a = a
    epoki = epoki
    proby = proby
    f1 = 0

    x1 = random.uniform(-15, 15)
    y1 = random.uniform(-15, 15)
    for i in range(epoki):
        for j in range(proby):
            f1 = func1(x1, y1)
            x2 = random.uniform(max(0.0, x1 - 2 * t), min(10.0, x1 + 2 * t))
            y2 = (random.uniform(max(0.0, y1 - 2 * t), min(10.0, y1 + 2 * t)))
            f2 = func1(x2, y2)


            if f1 < f2:
                x1 = x2
                y1 = y2
            elif (math.exp((f1 - f2) / t)) > random.uniform(0, 1):
                x1 = x2
                y1 = y2
        t *= a

    return (x1, y1, f1)

if __name__ == '__main__':
    x, y, f1 = example1(90, 0.99, 200, 2)
    print("Ekstemum znalezione w punkcie: (%f, %f)" % (x, y) + " o wartości " + str(f1))




