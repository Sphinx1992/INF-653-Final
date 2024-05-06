// Import the State model
const State = require('../model/State');

// Create an empty object to hold controller functions
const statesController = {};

// Define the getAllStates controller function, which returns all states from a JSON file and adds a random fun fact for each state
statesController.getAllStates = async (req, res) => {
  // Get the "contig" query parameter from the request object
  const { contig } = req.query;

  // Load the states from the JSON file
  let states = require('../data/states.json');

  // Filter the states based on the value of the "contig" query parameter
  if (contig === 'true') {
    states = states.filter((state) => !['AK', 'HI'].includes(state.code));
  } else if (contig === 'false') {
    states = states.filter((state) => ['AK', 'HI'].includes(state.code));
  }

  // Find all states with fun facts using the State model
  const statesWithFunFacts = await State.find();

  // Loop through each state and add a random fun fact if available
  states.forEach((state) => {
    const stateWithFunFact = statesWithFunFacts.find((s) => s.code === state.code);
    if (stateWithFunFact) {
      state.funfact = stateWithFunFact.funfacts[Math.floor(Math.random() * stateWithFunFact.funfacts.length)];
    }
  });

  // Send the updated list of states as a JSON response
  res.json(states);
};

statesController.getState = async (req, res) => {
  // Find the state object in the JSON file based on the given state code
  const state = require('../data/states.json').find((s) => s.code === req.params.state);

  // If the state does not exist, send a 404 error response
  if (!state) {
    res.status(404).send(`State ${req.params.state} not found`);
    return;
  }

  // Find the state object in the database based on the given state code
  const stateWithFunFacts = await State.findOne({ code: req.params.state });

  // If a state object is found in the database, add a random fun fact to the state object
  if (stateWithFunFacts) {
    state.funfact = stateWithFunFacts.funfacts[Math.floor(Math.random() * stateWithFunFacts.funfacts.length)];
  }

  // Send the state object (with the fun fact, if available) as a JSON response
  res.json(state);
};

// Retrieves a random fun fact for a given state
statesController.getRandomFunFact = async (req, res) => {
  // Finds the state with the specified code in the State model
  const stateWithFunFacts = await State.findOne({ code: req.params.state });
  // If no state is found or if there are no fun facts for the state, return a 404 error
  if (!stateWithFunFacts || stateWithFunFacts.funfacts.length === 0) {
    res.status(404).send(`No fun facts found for state ${req.params.state}`);
    return;
  }
  // Picks a random fun fact for the state from the list of fun facts
  const funFact = stateWithFunFacts.funfacts[Math.floor(Math.random() * stateWithFunFacts.funfacts.length)];
  // Sends the fun fact as a JSON response
  res.json(funFact);
};

// Define the function to handle the GET request
statesController.getCapital = (req, res) => {
  // Find the state in the "states.json" file using its code
  const state = require('../data/states.json').find((s) => s.code === req.params.state);
  
  // If the state is not found, send a 404 error response and return
  if (!state) {
    res.status(404).send(`State ${req.params.state} not found`);
    return;
  }

  // If the state is found, create an object containing the name of the state and its capital
  const capitalObject = { state: state.name, capital: state.capital };
  
  // Send the object as a JSON response
  res.json(capitalObject);
};

// Define a function to handle GET requests for the nickname of a specific state
statesController.getNickname = (req, res) => {
  // Load the states data and find the state matching the given state code in the request parameters
  const state = require('../data/states.json').find((s) => s.code === req.params.state);
  // If the state cannot be found, return a 404 response with an error message
  if (!state) {
    res.status(404).send(`State ${req.params.state} not found`);
    return;
  }
  // If the state is found, return a JSON response containing the state's name and nickname
  res.json({ state: state.name, nickname: state.nickname });
};

const getPopulation = (req, res) => {
  // Load the state data from the states.json file
  const state = require('../data/states.json').find((s) => s.code === req.params.state);
  // If the state is not found, return a 404 error with a message
  if (!state) {
    res.status(404).send(`State ${req.params.state} not found`);
    return;
  }
  // If the state is found, return a JSON object with the state's name and population
  res.json({ state: state.name, population: state.population });
};

// This function handles GET requests to retrieve the admission date of a state
statesController.getAdmission = (req, res) => {
  // Find the state in the states.json file using the provided state code
  const state = require('../data/states.json').find((s) => s.code === req.params.state);

  // If the state is not found, return a 404 error response with an error message
  if (!state) {
    res.status(404).send(`State ${req.params.state} not found`);
    return;
  }

  // Get the admission date from the state object
  const admission = state.admission;

  // If no admission date is found, return a 404 error response with an error message
  if (!admission) {
    res.status(404).send(`No admission date found for ${state.name}`);
    return;
  }

  // Convert the admission date to an ISO string and return it in a JSON response
  const admissionDate = new Date(admission);
  res.status(200).json({ state: state.name, admitted: admissionDate.toISOString() });
};

//Post
exports.addFunFacts = async (req, res) => {
  try {
    const { state } = req.params;
    const { funfacts } = req.body;

    if (!funfacts || !Array.isArray(funfacts)) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const stateData = await State.findOne({ stateCode: state });

    if (!stateData) {
      const newStateData = new State({ stateCode: state, funfacts });
      await newStateData.save();
      return res.status(201).json(newStateData);
    }

    stateData.funfacts = [...stateData.funfacts, ...funfacts];
    await stateData.save();

    return res.status(200).json(stateData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//Patch
exports.updateFunFact = async (req, res) => {
  try {
    const { state } = req.params;
    const { index, funfact } = req.body;

    if (!index || !funfact) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const stateData = await State.findOne({ stateCode: state });

    if (!stateData || stateData.funfacts.length === 0 || stateData.funfacts.length < index) {
      return res.status(404).json({ message: 'Fun fact not found' });
    }

    stateData.funfacts[index - 1] = funfact;
    await stateData.save();

    return res.status(200).json(stateData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//Delete

exports.deleteFunFact = async (req, res) => {
  try {
    const { state } = req.params;
    const { index } = req.body;

    if (!index) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    const stateData = await State.findOne({ stateCode: state });

    if (!stateData || stateData.funfacts.length === 0 || stateData.funfacts.length < index) {
      return res.status(404).json({ message: 'Fun fact not found' });
    }

    stateData.funfacts = stateData.funfacts.filter((_, i) => i !== index - 1);
    await stateData.save();

    return res.status(200).json(stateData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};