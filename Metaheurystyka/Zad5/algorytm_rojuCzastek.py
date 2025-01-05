import numpy as np

# Definicja funkcji celu
def function(x, y):
    return (x + 2 * y - 7) ** 2 + (2 * x + y - 5) ** 2

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
        r1, r2 = np.random.rand(2)
        self.velocity = (
            i * self.velocity
            + wp * r1 * (self.personal_best_position - self.position)
            + ws * r2 * (global_best_position - self.position)
        )

    def update_position(self, bounds):
        self.position += self.velocity
        self.position[0] = np.clip(self.position[0], bounds[0][0], bounds[0][1])
        self.position[1] = np.clip(self.position[1], bounds[1][0], bounds[1][1])

    def adaptation(self):
        score = function(self.position[0], self.position[1])
        if score < self.personal_best_score:
            self.personal_best_score = score
            self.personal_best_position = np.copy(self.position)


# Algorytm roju cząstek (PSO)
def particle_swarm_optimization(num_particles=30, num_iterations=100, bounds=([-10, 10], [-10, 10]), i=0.2, wp=2, ws=2):
    # Inicjalizacja roju cząstek
    particles = [Particle(bounds) for _ in range(num_particles)]

    global_best_position = np.zeros(2)  # Zainicjowane jako wektor zerowy
    global_best_score = float('inf')

    for iteration in range(num_iterations):
        for particle in particles:
            # Aktualizacja prędkości i pozycji cząstek
            particle.adaptation()

            if particle.personal_best_score < global_best_score:
                global_best_score = particle.personal_best_score
                global_best_position = particle.personal_best_position

            particle.update_velocity(global_best_position, i, wp, ws)
            particle.update_position(bounds)

        # Wyświetlanie postępu
        print(f"Iteracja {iteration + 1}/{num_iterations}, Najlepszy wynik: {global_best_score}")

    return global_best_position, global_best_score

if __name__ == "__main__":
    best_position, best_score = particle_swarm_optimization()
    print(f"Najlepsza pozycja: {best_position}")
    print(f"Najlepszy wynik: {best_score}")
