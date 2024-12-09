import math
import random
import numpy as np
import matplotlib.pyplot as plt

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

# Reading data from the file
file_name = "A-n32-k5.txt"
attractions_list = read_file(file_name)

class Ant:
    best_route = 0

    def __init__(self, attraction):
        self.attraction = attraction
        self.memory = []
        rand = random.randint(0, self.attraction - 1)
        self.memory.append(rand)



    def calculate_route(self, currentAtraction, attraction):
        return np.sqrt((attractions_list[currentAtraction][1] - attractions_list[attraction][1])**2 + (attractions_list[currentAtraction][2] - attractions_list[attraction][2])**2)


    def total_distance(self):
        totalDistance = 0

        for index in range(0, len(self.memory) - 1):
            totalDistance += np.sqrt((attractions_list[self.memory[index]][1] - attractions_list[self.memory[index + 1]][1])**2 + (attractions_list[self.memory[index]][2] - attractions_list[self.memory[index + 1]][2])**2)

        return totalDistance


def create_pheromone(quantAttraction):
    pheromone = [[1 for _ in range(quantAttraction)] for _ in range(quantAttraction)]
    return pheromone

def configure(atractions, quant):
  colony = []

  for i in range (quant):
    colony.append(Ant(atractions))

  return colony


def probabilistically(ant, alpha, beta, pheromone):
    currentAtraction = ant.memory[-1]
    allAtraction = [i for i in range(len(attractions_list))]
    avaliAttraction = allAtraction.copy()

    avaliAttraction = [element for element in avaliAttraction if element not in ant.memory]
    usedIndex = []
    probability = []
    sumProbability = 0

    for attraction in avaliAttraction:
        usedIndex.append(attraction)
        pheromonePath = math.pow(pheromone[currentAtraction][attraction], alpha)
        heuristicPath = math.pow(1 / ant.calculate_route(currentAtraction, attraction), beta)
        probability.append(pheromonePath * heuristicPath)

        sumProbability += pheromonePath * heuristicPath

    probability = [prob / sumProbability for prob in probability]

    return usedIndex, probability

def selection(usedIndex, probability, ant):
    allAtraction = [i for i in range(len(attractions_list))]
    avaliAttraction = allAtraction.copy()

    avaliAttraction = [element for element in avaliAttraction if element not in ant.memory]

    sums = 0
    ranges = []
    for i in range (len(avaliAttraction)):
        ranges.append([usedIndex[i], sums, sums + probability[i]])
        sums += probability[i]

    rand = random.uniform(0, 1)
    result = [rang for rang in ranges if rang[1] < rand <= rang[2]]
    if result:
        return result[0][0]
    return None

def update_pheromones(evaporationRate, pheromone, quantAttraction, colony):
    for x in range (0, quantAttraction):
        for y in range (0, quantAttraction):
            pheromone[x][y] *= evaporationRate

            for ant in colony:
                pheromone[x][y] += 1 / ant.total_distance()

def best(colony, prevBestAnt):
    bestAnt = prevBestAnt
    for ant in colony:
        distance = ant.total_distance()
        if distance < bestAnt.total_distance():
            bestAnt = ant

    return bestAnt

def ant_algorithm(iteration, evaporationRate, quant, quantAttraction, alpha, beta):
    pheromone = create_pheromone(quantAttraction)
    bestAnt = None
    for i in range(iteration):
        colony = configure(quantAttraction, quant)
        bestAnt = colony[0]
        print(i)
        for ant in colony:
            for j in range(quantAttraction - 1):
                usedIndex, probability = probabilistically(ant, alpha, beta, pheromone)
                rand = random.uniform(0, 1)
                if rand <= 0.1:
                    ant.memory.append(selection(usedIndex, probability, ant))
                else:
                    ant.memory.append(usedIndex[probability.index(max(probability))])

        update_pheromones(evaporationRate, pheromone, quantAttraction, colony)
        bestAnt = best(colony, bestAnt)

    return bestAnt




if __name__ == '__main__':
    # print("1. A-n32-k5.txt")
    # print("2. A-n80-k10.txt")
    #file = int(input("Wybierz plik: "))
    file = 2

    if file == 1:
        file_name = "A-n32-k5.txt"
    else:
        file_name = "A-n80-k10.txt"

    attractions_list = read_file(file_name)

    if file == 1:
        result = ant_algorithm(1,0.1,10,32,1,2)
    else:
        result = ant_algorithm(2, 0.1, 5, 80, 1, 2)

    print(result.total_distance())

    x = []
    y = []

    for memory in result.memory:
        x.append(attractions_list[memory][1])
        y.append(attractions_list[memory][2])

    plt.plot(x, y, color='blue', marker='o')
    for i in range(len(x)):
        plt.text(x[i], y[i], f'({result.memory[i] + 1})', fontsize=6, ha='right', va='bottom')

    plt.show()



