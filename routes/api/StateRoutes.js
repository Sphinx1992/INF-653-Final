

const express = require("express");
const router = express.Router();
const stateController = require("../../controller/stateController");
const {verifyStateParameter} = require("../../middleware/verifyStateParameter");

// Middleware to verify state code is correct
router.use("/:state", verifyStateParameter);


//Route to get all states
router.get('/', stateController.getAllStates);


//Route to get single state
router.get('/:state', stateController.getState);



// Route to get a random fun fact for a specific state
router.get('/:state/funfact', stateController.getRandomFunFact);

// Route to get the capital city of a specific state
router.get('/:state/capital', stateController.getCapital);

// Route to get the nickname of a specific state
router.get('/:state/nickname', stateController.getNickname);

// Route to get the population of a specific state
router.get('/:state/population', stateController.getPopulation);

// Route to get the admission date of a specific state
router.get('/:state/admission', stateController.getAdmission);

// Route to add fun facts to a specific state
router.post('/:state/funfact', stateController.addFunFacts);

// Route to update a specific fun fact for a state
router.patch('/:state/funfact', stateController.updateFunFact);

// Route to delete a specific fun fact for a state
router.delete('/:state/funfact', stateController.deleteFunFact);


  

module.exports = router;
