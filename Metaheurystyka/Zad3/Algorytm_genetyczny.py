import random

items = [
    {"name": "Toporek", "weight": 32252, "value": 68674},
    {"name": "Moneta z brązu", "weight": 225790, "value": 471010},
    {"name": "Korona", "weight": 468164, "value": 944620},
    {"name": "Diamentowy posążek", "weight": 489494, "value": 962094},
    {"name": "Szmaragdowy pas", "weight": 35384, "value": 78344},
    {"name": "Skamieliny", "weight": 265590, "value": 579152},
    {"name": "Złota moneta", "weight": 497911, "value": 902698},
    {"name": "Hełm", "weight": 800493, "value": 1686515},
    {"name": "Tusz", "weight": 823576, "value": 1688691},
    {"name": "Szkatułka", "weight": 552202, "value": 1056157},
    {"name": "Nóż", "weight": 323618, "value": 677562},
    {"name": "Długi miecz", "weight": 382846, "value": 833132},
    {"name": "Maska", "weight": 44676, "value": 99192},
    {"name": "Naszyjnik", "weight": 169738, "value": 376418},
    {"name": "Opalowa zawieszka", "weight": 610876, "value": 1253986},
    {"name": "Perły", "weight": 854190, "value": 1853562},
    {"name": "Kołczan", "weight": 671123, "value": 1320297},
    {"name": "Rubinowy pierścień", "weight": 698180, "value": 1301637},
    {"name": "Srebrna bransoletka", "weight": 446517, "value": 859835},
    {"name": "Czasomierz", "weight": 909620, "value": 1677534},
    {"name": "Mundur", "weight": 904818, "value": 1910501},
    {"name": "Trucizna", "weight": 730061, "value": 1528646},
    {"name": "Wełniany szal", "weight": 931932, "value": 1827477},
    {"name": "Kusza", "weight": 952360, "value": 2068204},
    {"name": "Stara księga", "weight": 926023, "value": 1746556},
    {"name": "Puchar z cynku", "weight": 978724, "value": 2100851},
]

max_weight = 6404180
population_size = 100
generations = 1000
crossing_prob = 0.8
mutation_prob = 0.5


def generate_first_population(population_size):
    population = []
    for i in range (0, population_size):
        individual = [random.randint(0, 1) for _ in range(len(items))]
        population.append(individual)
    return population


def adaptation(individual):
    weight_in_bag = 0
    value = 0
    for i in range(0, len(items)):
        actual = individual[i]
        if actual == 1:
            weight_in_bag += items[i]["weight"]
            value += items[i]["value"]
    if weight_in_bag > max_weight:
        return 0
    else:
        return weight_in_bag

def propability(population):
    adaptation_values = [adaptation(i) for i in population]
    total_adaptation = sum(adaptation_values)
    propability_values = []
    for j in range(len(population)):
        propability_values.append(adaptation_values[j]/total_adaptation)

    return propability_values


def selection(population):
    propability_values = propability(population)

    sum = 0
    ranges = []
    for prop in propability_values:
        sum += prop
        ranges.append(sum)

    random_value = random.uniform(0, 1)

    for j, prop in enumerate(propability_values):
        if random_value <= ranges[j]:
            return population[j]


def crossing(parent1, parent2, point):
    childs = []
    childs.append(parent1[:point] + parent2[point:])
    childs.append(parent2[:point] + parent1[point:])

    return childs

def mutation(individual):
    rand = random.randint(0, len(items) - 1)
    if individual[rand] == 0:
        individual[rand] = 1
    else:
        individual[rand] = 0


def genetic_algorithm():
    population = generate_first_population(population_size)

    for generation in range(generations):
        new_population = []
        while len(new_population) < population_size:
            childs = []
            parent1 = selection(population)
            parent2 = selection(population)
            if random.uniform(0, 1) < crossing_prob:
                childs = crossing(parent1, parent2, 13)
            if random.uniform(0, 1) < mutation_prob and len(childs) == 2:
                mutation(childs[0])
                mutation(childs[1])
                new_population.extend([childs[0], childs[1]])

        population = new_population[:population_size]
        best_individual = max(population, key=adaptation)
        best_adaptation = adaptation(best_individual)
        print(f"Pokolenie {generation + 1}: Najlepsza wartość = {best_adaptation}")

    return max(population, key=adaptation)

best_solution = genetic_algorithm()
best_value = adaptation(best_solution)

print("\nNajlepsze rozwiązanie:")
print(f"Wartość: {best_value}")
print("Przedmioty w plecaku:")
for i, gen in enumerate(best_solution):
    if gen == 1:
        print(f"- {items[i]['name']} (waga: {items[i]['weight']}, wartość: {items[i]['value']})")
