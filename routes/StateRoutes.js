const express = require('express');
const router = express.Router();

// Import the statesController
const statesController = require('../controller/statesController');

// Define the routes
router.get('/', statesController.getAllStates);
router.get('/:state', statesController.getState);
router.get('/:state/funfact', statesController.getRandomFunFact);
router.get('/:state/capital', statesController.getCapital);
router.get('/:state/nickname', statesController.getNickname);
router.get('/:state/population', statesController.getPopulation);
router.get('/:state/admission', statesController.getAdmission);
router.post('/:state/funfacts', statesController.addFunFacts);
router.put('/:state/funfacts', statesController.updateFunFact);
router.delete('/:state/funfacts', statesController.deleteFunFact);

module.exports = router;