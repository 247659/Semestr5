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
generations = 500
crossing_prob = 0.5
mutation_prob = 0.5
hard_mutation_prob = 0.1


def generate_first_population(population_size):
    population = []
    for i in range (0, population_size):
        individual = [random.randint(0, 1) for _ in range(len(items))]
        while adaptation(individual) == 0:
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
        return value


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

    for j, prop in enumerate(ranges):
        if random_value <= ranges[j]:
            return population[j]


def tournament_selection(population, size):
    group = random.sample(population, size)
    best = max(group, key=adaptation)

    return best

def crossing(parent1, parent2, point):
    return [parent1[:point] + parent2[point:], parent2[:point] + parent1[point:]]


def double_crossing(parent1, parent2, point1, point2):
    if point1 > point2:
        point1, point2 = point2, point1

    child1 = parent1[:point1] + parent2[point1:point2] + parent1[point2:]
    child2 = parent2[:point1] + parent1[point1:point2] + parent2[point2:]

    return [child1, child2]


def mutation(individual):
    rand = random.randint(0, len(items) - 1)
    individual[rand] ^= 1


def hard_mutation(individual):
    for i in range (len(individual)):
        individual[i] ^= 1


def genetic_algorithm(method, select):
    population = generate_first_population(population_size)
    improvement = 0
    best_adaptation = 0
    best_solution = []

    for generation in range(generations):

        parents = []
        while len(parents) < population_size / 2:
            if select == 1:
                parents.append(selection(population))
            elif select == 2:
                parents.append(tournament_selection(population, 5))

        new_population = []

        while len(new_population) < population_size:
            parent1 = random.choice(parents)
            parent2 = random.choice(parents)

            if random.uniform(0, 1) < crossing_prob:
                if method == 2:
                    childs = double_crossing(parent1, parent2, 9, 18)
                elif method == 1:
                    childs = crossing(parent1, parent2, 13)
            else:
                childs = [parent1, parent2]

            for child in childs:
                if random.uniform(0, 1) < mutation_prob:
                    if random.uniform(0, 1) < hard_mutation_prob:
                        hard_mutation(child)
                    else:
                        mutation(child)
                new_population.append(child)

        population = new_population[:population_size]
        best_individual = max(population, key=adaptation)
        current_adaptation = adaptation(best_individual)
        print(f"Pokolenie {generation + 1}: Najlepsza wartość = {current_adaptation}")

        if current_adaptation > best_adaptation:
            best_adaptation = current_adaptation
            best_solution = best_individual
            improvement = 0
        else:
            improvement += 1

        if improvement > 50:
            break

    return best_adaptation, best_solution


best_value, best_solution = genetic_algorithm(2, 1)

print("\nNajlepsze rozwiązanie:")
print(f"Wartość: {best_value}")
print("Przedmioty w plecaku:")
for i, gen in enumerate(best_solution):
    if gen == 1:
        print(f"- {items[i]['name']} (waga: {items[i]['weight']}, wartość: {items[i]['value']})")

