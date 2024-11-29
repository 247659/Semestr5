import numpy as np
import random
def read_file(file_name):
    attractions = []
    try:
        with open(file_name, "r") as file:
            for line in file:
                # Split the line into parts
                data = line.split()
                # Parse the attraction number and coordinates
                attraction_id = int(data[0]) - 1
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
    memory = []
    best_route = 0

    def __init__(self, attraction):
        self.attraction = attraction
        rand = random.randint(0, self.attraction - 1)
        self.memory.append(attractions_list[rand])


    def calculate_route(self, index):
        return np.sqrt((self.memory[index][1] - self.memory[index + 1][1])**2 + (self.memory[index][2] - self.memory[index + 1][2])**2)


    def total_distance(self):
        totalDistance = 0

        for i in range(len(self.memory) - 1):
            totalDistance += self.calculate_route(i)

        return totalDistance