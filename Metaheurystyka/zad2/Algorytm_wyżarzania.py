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
    x1 = random.uniform(-15, 15)
    y1 = random.uniform(-15, 15)

    best_result = func1(x1, y1)
    best_x = x1
    best_y = y1

    for i in range(epoki):
        for j in range(proby):
            f1 = func1(x1, y1)
            x2 = random.uniform(max(-15.0, x1 - 0.04 * t), min(15.0, x1 + 0.04 * t))
            y2 = (random.uniform(max(-15.0, y1 - 0.04 * t), min(15.0, y1 + 0.04 * t)))
            f2 = func1(x2, y2)


            if f1 < f2 or (math.exp((f1 - f2) / t)) > random.uniform(0, 1):
                x1 = x2
                y1 = y2

            if func1(x1, y1) > best_result:
                best_x = x1
                best_y = y1
                best_result = func1(x1, y1)

        t *= a

    return (best_x, best_y, best_result)

def example2(t, a, epoki, proby):

    x1 = random.uniform(-1, 2)
    f1 = func2(x1)
    best_x = x1
    best_result = f1

    for i in range(epoki):
        for j in range(proby):
            f1 = func2(x1)
            x2 = random.uniform(max(-1.0, x1 - 0.2 * t), min(2.0, x1 + 0.2 * t))
            f2 = func2(x2)

            if f1 < f2 or (math.exp((f1 - f2) / t)) > random.uniform(0, 1):
                x1 = x2

            if func2(x1) > best_result:
                best_x = x1
                best_result = func2(x1)

        t *= a

    return (best_x, best_result)

if __name__ == '__main__':
    x, y, f1 = example1(90, 0.999, 300, 5)
    print(f"Ekstemum znalezione w punkcie: ({x:.2f}, {y:.2f}) o wartości {f1}")

    x2, f1_2 = example2(5, 0.997, 1200, 3)
    print(f"Ekstemum znalezione w punkcie x: ({x2:.2f}) o wartości {f1_2}")





