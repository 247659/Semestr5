from Ants import Ant




ants = Ant(32)

data = [0, 1, 1]
ants.memory.append(data)
data = [1,4,5]
ants.memory.append(data)
print(ants.memory)
print(ants.total_distance())


