import numpy as np

def function(x, y):
    return np.cos(x) * -1 * np.cos(y) * np.exp(-1*((x-np.pi)**2 + (y-np.pi)**2))

def function2(x, y):
    return np.sin(x + y) + (x - y) ** 2 - 1.5 * x + 2.5 * y + 1


class Particle:
    def __init__(self, bounds):
        self.position = np.array([
            np.random.uniform(bounds[0][0], bounds[0][1]),
            np.random.uniform(bounds[1][0], bounds[1][1])
        ])
        self.personal_best_position = np.copy(self.position)
        self.velocity = np.array([0.0, 0.0])
        self.personal_best_score = float('inf')

    def update_velocity(self, global_best_position, i, ws, wp):
        r1 = np.random.uniform(0, 1)
        r2 = np.random.uniform(0, 1)
        self.velocity = (
                i * self.velocity
                + wp * r1 * (self.personal_best_position - self.position)
                + ws * r2 * (global_best_position - self.position)
        )

    def update_position(self, bounds):
        self.position += self.velocity
        self.position[0] = np.clip(self.position[0], bounds[0][0], bounds[0][1])
        self.position[1] = np.clip(self.position[1], bounds[1][0], bounds[1][1])

    def adaptation(self, func):
        score = func(self.position[0], self.position[1])
        if score < self.personal_best_score:
            self.personal_best_score = score
            self.personal_best_position = np.copy(self.position)


def particle_swarm_optimization(num_particles, bounds, i, wp, ws, func):
    particles = [Particle(bounds) for _ in range(num_particles)]

    improvement = 0
    iteration = 0
    global_best_position = np.zeros(2)
    global_best_score = float('inf')
    previous_global_best_score = float('inf')

    while True:
        iteration += 1
        for particle in particles:
            particle.adaptation(func)

            if particle.personal_best_score < global_best_score:
                global_best_score = particle.personal_best_score
                global_best_position = particle.personal_best_position

            particle.update_velocity(global_best_position, i, wp, ws)
            particle.update_position(bounds)


        if global_best_score < previous_global_best_score:
            previous_global_best_score = global_best_score
            improvement = 0
        else:
            improvement += 1

        if improvement >= 30:
            print(f"Iteracja {iteration}")
            break

    return global_best_position, global_best_score


if __name__ == "__main__":
    best_position, best_score = particle_swarm_optimization(num_particles=50,
                                                            bounds=([-100, 100], [-100, 100]), i=0.2, wp=1, ws=1,
                                                            func=function)
    print(f"Najlepsza pozycja: {best_position}")
    print(f"Najlepszy wynik: {best_score}")

    best_position, best_score = particle_swarm_optimization(num_particles=50,
                                                            bounds=([-1.5, 4], [-3, 4]), i=0.2, wp=1, ws=1,
                                                            func=function2)
    print(f"Najlepsza pozycja: {best_position}")
    print(f"Najlepszy wynik: {best_score}")
