import math
import random


def func1(x):
    wynik = x * math.sin(10 * math.pi * x) + 1
    return wynik

def func2(x):
    if -105 < x < -95:
        return 10 - 2 * abs(x + 100)
    elif 95 < x < 105:
        return 11 - 2.2 * abs(x - 100)
    else:
        return 0

def maximum(t, a, epoki, proby, k, func, start, end):

    x1 = random.uniform(start, end)
    f1 = func(x1)
    best_x = x1
    best_result = f1


    for i in range(epoki):
        for j in range(proby):
            f1 = func(x1)
            x2 = random.uniform(max(start, x1 - 0.2 * t), min(end, x1 + 0.2 * t))
            f2 = func(x2)

            if f1 < f2 or (math.exp((f1 - f2) / t * k)) > random.uniform(0, 1):
                x1 = x2

            if func(x1) > best_result:
                best_x = x1
                best_result = func(x1)

        t *= a

    return (best_x, best_result)

if __name__ == '__main__':

    x1, f1_1 = maximum(5, 0.997, 1200, 1, 0.1, func1, -1, 2)
    print(f"Ekstemum znalezione w punkcie x: ({x1:.2f}) o wartości {f1_1}")

    x2, f1_2 = maximum(500, 0.999, 3000, 1, 0.1, func2, -150, 150)
    print(f"Ekstemum znalezione w punkcie x: ({x2:.2f}) o wartości {f1_2}")





