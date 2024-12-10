import random

import matplotlib.pyplot as plt
import numpy as np
import time


def read_file(file_name):
    attractions = []
    try:
        with open(file_name, "r") as file:
            for line in file:
                # Split the line into parts
                data = line.split()
                # Parse the attraction number and coordinates
                attraction_id = int(data[0])
                x_coord = float(data[1])
                y_coord = float(data[2])
                # Add as a tuple (id, x, y) to the list
                attractions.append([attraction_id, x_coord, y_coord])
    except FileNotFoundError:
        print(f"File '{file_name}' does not exist!")
    except ValueError:
        print("Error in the file structure!")
    return attractions

class Ant:
    def __init__(self, num_attractions):
        self.memory = [random.randint(0, num_attractions - 1)]
        self.total_distance = 0.0

    def calculate_distance(self, a, b):
        ax, ay = attractions_list[a][1:]
        bx, by = attractions_list[b][1:]
        return np.hypot(ax - bx, ay - by)

    def update_distance(self):
        self.total_distance = sum(
            self.calculate_distance(self.memory[i], self.memory[i + 1])
            for i in range(len(self.memory) - 1)
        )

def initialize_pheromone_matrix(size):
    return np.ones((size, size))

def create_colony(num_ants, num_attractions):
    return [Ant(num_attractions) for _ in range(num_ants)]

def calculate_probabilities(ant, pheromone, alpha, beta):
    current = ant.memory[-1]
    unvisited = set(range(len(attractions_list))) - set(ant.memory)
    probabilities = []

    for attraction in unvisited:
        pheromone_strength = pheromone[current][attraction] ** alpha
        heuristic_value = (1 / ant.calculate_distance(current, attraction)) ** beta
        probabilities.append((attraction, pheromone_strength * heuristic_value))

    total = sum(prob[1] for prob in probabilities)
    probabilities = [(attraction, prob / total) for attraction, prob in probabilities]
    return probabilities

def selection(probabilities):
    r = random.uniform(0, 1)
    cumulative = 0
    for attraction, prob in probabilities:
        cumulative += prob
        if r <= cumulative:
            return attraction
    return probabilities[-1][0]

def update_pheromones(pheromone, colony, evaporation_rate):
    pheromone *= evaporation_rate
    for x in range (len(attractions_list)):
        for y in range (len(attractions_list)):
            for ant in colony:
                pheromone[x][y] += 1 / ant.total_distance

def best(colony, prevBestAnt):
    bestAnt = prevBestAnt
    tempBestAnt = min(colony, key=lambda ant: ant.total_distance)
    if tempBestAnt.total_distance < bestAnt.total_distance:
        bestAnt = tempBestAnt

    return bestAnt
def find_best_ant(colony):
    return min(colony, key=lambda ant: ant.total_distance)

def ant_colony_optimization(iterations, evaporation_rate, num_ants, num_attractions, alpha, beta):
    pheromone = initialize_pheromone_matrix(num_attractions)
    best_ant = None

    for i in range(iterations):
        colony = create_colony(num_ants, num_attractions)
        best_ant = colony[0]
        print(i)
        for ant in colony:
            for _ in range(num_attractions - 1):
                probabilities = calculate_probabilities(ant, pheromone, alpha, beta)
                rand = random.uniform(0, 1)
                if rand <= 0.1:
                    next_attraction = selection(probabilities)
                    ant.memory.append(next_attraction)
                else:
                    next_attraction = max(probabilities, key=lambda x: x[1])
                    ant.memory.append(next_attraction[0])


            ant.update_distance()

        update_pheromones(pheromone, colony, evaporation_rate)
        best_ant = best(colony, best_ant)
        # current_best = find_best_ant(colony)
        # if best_ant is None or current_best.total_distance < best_ant.total_distance:
        #     best_ant = current_best

    return best_ant

if __name__ == "__main__":
    start_time = time.time()
    file_name = "A-n80-k10.txt"
    attractions_list = read_file(file_name)

    if attractions_list:
        best_result = ant_colony_optimization(
            iterations=100, evaporation_rate=0.1, num_ants=50, num_attractions=len(attractions_list), alpha=1, beta=2
        )
        end_time = time.time()
        execution_time = end_time - start_time

        print(f"Shortest Distance: {best_result.total_distance:.2f}")
        print(f"Memory: {best_result.memory}")
        x = [attractions_list[i][1] for i in best_result.memory]
        y = [attractions_list[i][2] for i in best_result.memory]
        plt.title(f"Distance: {best_result.total_distance:.2f}")
        plt.plot(x, y, marker="o", color="blue")
        plt.plot(attractions_list[best_result.memory[0]][1], attractions_list[best_result.memory[0]][2],marker="o", color="red")
        for i, (x_coord, y_coord) in enumerate(zip(x, y)):
            plt.text(x_coord, y_coord, f"{best_result.memory[i] + 1}", fontsize=6)
        plt.show()

        print(f"Czas wykonania: {execution_time:.5f} sekund")