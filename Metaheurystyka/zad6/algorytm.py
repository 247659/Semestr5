import random
import math
import matplotlib
matplotlib.use('TkAgg')  # Użyj backendu TkAgg
import matplotlib.pyplot as plt

def load_data(filename):
    customers = []
    with open(filename, "r") as file:
        for line in file:
            parts = line.split()
            customer = {
                'id': int(parts[0]),
                'x': float(parts[1]),
                'y': float(parts[2]),
                'demand': float(parts[3]),
                'ready_time': float(parts[4]),
                'due_date': float(parts[5]),
                'service_time': float(parts[6]),
            }
            customers.append(customer)
    return customers


# Funkcja do obliczania odległości między dwoma punktami
def distance(c1, c2):
    return math.sqrt((c1['x'] - c2['x'])**2 + (c1['y'] - c2['y'])**2)


# Funkcja oceny rozwiązania z uwzględnieniem czasu gotowości
def evaluate_solution(solution, customers, vehicle_capacity, depot):
    total_distance = 0
    total_violation = 0

    for route in solution:
        current_capacity = 0
        current_time = 0
        last_customer = depot
        for customer_id in route:
            customer = customers[customer_id - 1]
            dist = distance(last_customer, customer)
            total_distance += dist
            # current_time += dist

            if current_time < customer['ready_time']:
                wait_time = customer['ready_time'] - current_time
                current_time += wait_time
                total_violation += wait_time
            elif current_time > customer['due_date']:
                total_violation += (current_time - customer['due_date'])

            current_time += customer['service_time']
            current_capacity += customer['demand']

            if current_capacity > vehicle_capacity:
                total_violation += current_capacity - vehicle_capacity

            last_customer = customer

        dist = distance(last_customer, depot)
        total_distance += dist

    return total_distance, total_violation, total_distance + 0.1 * total_violation


def sort_route_by_ready_time(route, customers):
    return sorted(route, key=lambda customer_id: customers[customer_id - 1]['ready_time'])


# Inicjalizacja populacji z użyciem heurystyki Nearest Neighbor
def initialize_population(customers, population_size, num_vehicles):
    population = []
    for _ in range(population_size):
        routes = nearest_neighbor_solution(customers, num_vehicles)
        routes = [sort_route_by_ready_time(route, customers) for route in routes]
        population.append(routes)
    return population

def nearest_neighbor_solution(customers, num_vehicles):
    depot = customers[0]
    remaining_customers = customers[1:]
    random.shuffle(remaining_customers)

    routes = [[] for _ in range(num_vehicles)]
    vehicle_idx = 0

    while remaining_customers:
        if not routes[vehicle_idx]:
            last_customer = depot
        else:
            last_customer = customers[routes[vehicle_idx][-1] - 1]

        nearest_customer = min(remaining_customers, key=lambda c: distance(last_customer, c))
        routes[vehicle_idx].append(nearest_customer['id'])
        remaining_customers.remove(nearest_customer)

        vehicle_idx = (vehicle_idx + 1) % num_vehicles

    return routes


# Selekcja (turniejowa)
def selection(population, customers, vehicle_capacity, depot, tournament_size=5):
    selected = []
    for _ in range(len(population)):
        tournament = random.sample(population, tournament_size)
        best = min(tournament, key=lambda x: evaluate_solution(x, customers, vehicle_capacity, depot)[2])
        selected.append(best)
    return selected


# Krzyżowanie (PMX)
def crossover(parent1, parent2):
    flat_parent1 = [customer for route in parent1 for customer in route]
    flat_parent2 = [customer for route in parent2 for customer in route]

    route_size = len(parent1[0])

    size = len(flat_parent1)
    point1, point2 = sorted(random.sample(range(size), 2))

    child = [None] * size

    child[point1:point2] = flat_parent1[point1:point2]

    ptr = 0
    for i in range(size):
        if child[i] is None:
            while flat_parent2[ptr] in child:
                ptr += 1
            child[i] = flat_parent2[ptr]
            ptr += 1

    child_routes = []
    current_route = []
    for customer in child:
        if not current_route or len(current_route) < route_size:
            current_route.append(customer)
        else:
            child_routes.append(current_route)
            current_route = [customer]
    if current_route:
        child_routes.append(current_route)

    return child_routes


# Mutacja (swap)
def mutate(solution, mutation_rate):
    for i in range(len(solution)):
        if random.random() < mutation_rate:
            j = random.randint(0, len(solution) - 1)
            solution[i], solution[j] = solution[j], solution[i]
    return solution


def two_opt(route, customers, depot):
    improved = True
    while improved:
        improved = False
        for i in range(1, len(route) - 1):
            for j in range(i + 1, len(route)):
                new_route = route[:i] + route[i:j][::-1] + route[j:]
                new_distance, new_violation, new_total = evaluate_solution([new_route], customers, vehicle_capacity, depot)
                old_distance, old_violation, old_total = evaluate_solution([route], customers, vehicle_capacity, depot)
                if new_total < old_total:
                    route = new_route
                    improved = True
                    # print('wykonano')
    return route


def calculate_route_distance(route, customers):
    depot = customers[0]
    total_distance = 0
    last_customer = depot
    for customer_id in route:
        customer = customers[customer_id - 1]
        total_distance += distance(last_customer, customer)
        last_customer = customer
    total_distance += distance(last_customer, depot)
    return total_distance


# Funkcja do rysowania tras
def plot_routes(routes, customers):
    depot = customers[0]
    colors = plt.cm.tab10.colors  # Kolory dla poszczególnych tras

    plt.figure(figsize=(10, 8))

    # Narysuj depot
    plt.scatter(depot['x'], depot['y'], c='red', marker='s', s=100, label='Depot')

    half_routes = routes[:len(routes) // 2]

    # Wyświetlanie wszystkich klientów
    # for customer in customers[1:]:
    #     plt.scatter(customer['x'], customer['y'], c='black', marker='o', s=50)

    # Wyświetlanie tylko kropek dla połowy pojazdów
    displayed_customers = set()
    for route in half_routes:
        displayed_customers.update(route)

    for customer_id in displayed_customers:
        customer = customers[customer_id - 1]
        plt.scatter(customer['x'], customer['y'], c='black', marker='o', s=50)

    # Narysuj trasy
    for i, route in enumerate(half_routes):
        x_coords = [depot['x']] + [customers[customer_id - 1]['x'] for customer_id in route] + [depot['x']]
        y_coords = [depot['y']] + [customers[customer_id - 1]['y'] for customer_id in route] + [depot['y']]
        plt.plot(x_coords, y_coords, marker='o', color=colors[i % len(colors)], label=f'Vehicle {i + 1}')

    plt.xlabel('X Coordinate')
    plt.ylabel('Y Coordinate')
    plt.title('Vehicle Routes')
    plt.legend()
    plt.grid(True)
    plt.show()



# Algorytm genetyczny z stagnacją
def genetic_algorithm(customers, vehicle_capacity, num_vehicles, population_size, generations,
                      mutation_rate, crossing_rate, stagnation_limit=20):
    depot = customers[0]
    population = initialize_population(customers, population_size, num_vehicles)

    best_solution = None
    best_distance = float('inf')
    stagnation_counter = 0

    for generation in range(generations):
        population = selection(population, customers, vehicle_capacity, depot)
        new_population = []

        # Elityzm: zachowaj najlepsze rozwiązanie
        current_best_solution = min(population, key=lambda x: evaluate_solution(x, customers, vehicle_capacity, depot)[2])
        current_distance, _, _ = evaluate_solution(current_best_solution, customers, vehicle_capacity, depot)
        new_population.append(current_best_solution)

        # Sprawdź, czy nastąpiła poprawa
        if current_distance < best_distance:
            best_solution = current_best_solution
            best_distance = current_distance
            stagnation_counter = 0
        else:
            stagnation_counter += 1

        # Sprawdź warunek stagnacji
        if stagnation_counter >= stagnation_limit:
            print(f"Stagnacja osiągnięta po {generation} generacjach. Kończenie działania.")
            break

        while len(new_population) < population_size:
            parent1, parent2 = random.sample(population, 2)
            if random.random() < crossing_rate:
                child1 = crossover(parent1, parent2)
                child2 = crossover(parent2, parent1)
            else:
                child1 = parent1
                child2 = parent2

            child1 = mutate(child1, mutation_rate)
            for i in range(len(child1)):
                child1[i] = two_opt(child1[i], customers, depot)
                child1[i] = sort_route_by_ready_time(child1[i], customers)
            new_population.append(child1)
            child2 = mutate(child2, mutation_rate)
            for i in range(len(child2)):
                child2[i] = two_opt(child2[i], customers, depot)
                child2[i] = sort_route_by_ready_time(child2[i], customers)
            new_population.append(child2)

        population = new_population

        # Ocena najlepszego rozwiązania w populacji
        print(f"Generation {generation}: Best Distance = {best_distance}, Stagnation Counter = {stagnation_counter}")

    return best_solution, best_distance


# Przykład użycia
if __name__ == "__main__":
    customers = load_data("rc1.txt")
    vehicle_capacity = 200
    best_solution, distance = genetic_algorithm(customers=customers, vehicle_capacity=vehicle_capacity, num_vehicles=15,
                                      generations=500, population_size=100, mutation_rate=0.3, crossing_rate=0.8)
    print("Best Solution: ", best_solution)
    print("Total distance: ", distance)
    print("Best Solution Routes:")
    for i, route in enumerate(best_solution):
        print(f"Vehicle {i + 1}: {route}")

    plot_routes(best_solution, customers)
