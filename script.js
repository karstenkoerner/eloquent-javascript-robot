// Eloquent Javascript "Robot" Project





const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];


// Graph object tells you where you can directly reach from a given node on the map.
function buildGraph(edges) {
  const graph = {};

  for (const road of edges) {

    const [from, to] = road.split("-");

    if (!graph[from]) {

      graph[from] = {
        name: from,
        edges: [to]
      };
    } else {
      graph[from].edges.push(to);
    }
    
    if (!graph[to]) {
      graph[to] = {
        name: to,
        edges: [from]
      };
    } else {
      graph[to].edges.push(from);
    }
  }

  return graph;
}

// Build the graph from the roads and store the returned graph object.
const graph = buildGraph(roads);



// State object represents the current state of the robot and its parcels.
class State {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  // Move the robot and parcels by manipulating the state (and perform validation logic)
  move(destination) {
    const validDestinations = graph[this.place].edges;

    if (validDestinations.includes(destination)) {

      for (const parcel of this.parcels) {

        if (parcel.place === this.place) {
          parcel.place = destination;
        }
      }

      this.place = destination;
      this.parcels = this.parcels.filter(parcel => parcel.place !== parcel.address);
    }
  }
}

// Create a State instance using the State class.
const state = new State("Alice's House", [
  {
    place: "Alice's House",
    address: "Town Hall"
  },
  {
    place: "Daria's House",
    address: "Shop"
  },
  {
    place: "Marketplace",
    address: "Bob's House"
  },
  {
    place: "Farm",
    address: "Shop"
  }
]);


// Use the robot function to repeatedly update the state using the data returned by the robot function.
function runRobot(state, robot) {
  let memory = [];

  while (state.parcels.length > 0) {
    const action = robot(state, memory);
    console.log(state);

    state.move(action.destination);
    memory = action.memory;
  }
}


// Pass the robot function into the runRobot function instead of using a single function in order to modularize the program further for more flexibility.
// The robot function is where our main intelligent engine resides. It is the brains behind where the robot decides to move based on its algorithm.
// The runRobot function is what controls the entire simulation, and when the program is considered finished. Think of runRobot() like the actual main program loop, while robot() is the robot itself.
function robot(state, memory) {
  const possibleDestinations = graph[state.place].edges;
  const randomIndex = Math.floor(Math.random() * possibleDestinations.length);

  return {
    destination: possibleDestinations[randomIndex],
    memory: memory
  };
}


runRobot(state, robot);