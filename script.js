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
// The robot function determines what to do next on a move-to-move basis. It is the brains behind where the robot decides to move based on its algorithm.
// The runRobot function is what controls the entire simulation, and when the program is considered finished. Think of runRobot() like the actual main program loop, while robot() is the robot itself.
function robot(state, memory) {
  
  // If the memory length is more than zero, we are currently on a path task initiated by a previous run of the runRobot loop. The robot saves the memory and feeds it back to runRobot which then gives it back the next go around.
  // The actual robot engine (in the else block below) will determine what paths to take next and then return a fresh memory array with all the locations which the next few iterations of robot() will simply feed the destination back to runRobot().
  // It's like a big game of catch, where they are constantly throwing data back and forth between each other. 
  if (memory.length > 0) {
    return {
      destination: memory[0],
      memory: memory.slice(1)
      };
  } else {
    const parcel = state.parcels[0];
    const target = parcel.place === state.place
      ? parcel.address
      : parcel.place;

      // A third level of modularization, the findRoute function represents another abstraction. This kind of modular thinking is necessary to keep large projects more organized.
    const route = findRoute(graph, state.place, target);

    return {
      destination: route[0],
      memory: route.slice(1)
    };
  }
}


// The findRoute is what returns an actual path based on where we want to go and where we are currently at. It is the pathfinder algorithm for our robot.
// It requires the graph object, a start place (where the robot currently is), and a target place (where the robot wants to navigate to).
// Something to note about all these functions is that even though you aren't technically required to pass many of these variables into the function (as they are usually global variables, such as state), we do so anyway.
// This is because it makes it easier to immediately know what a given function is dependent on. It's also good practice because it further modularizes the function and prevents it from relying upon a single state object, for example.
function findRoute(graph, start, target) {
  const discoveredNodes = [start];
  const work = [
    {
      place: start,
      route: []
    }
  ];

  for (let i = 0; i < work.length; i++) {
    const neighbors = graph[work[i].place].edges;

    for (const neighbor of neighbors) {
      if (neighbor === target) {
        const route = [...work[i].route, target];

        return route;
      } else if (!discoveredNodes.includes(neighbor)) {
        const route = [...work[i].route, neighbor];

        discoveredNodes.push(neighbor);
        work.push({
          place: neighbor,
          route: route
        });
      }
    }
  }
}


runRobot(state, robot);