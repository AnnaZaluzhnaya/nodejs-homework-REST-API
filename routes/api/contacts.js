const express = require('express')

const router = express.Router()

const contactsControllers = require('../../controllers/contactsControllers')
const isValidId = require("../../middlewares/isValidId");
const authenticate = require("../../middlewares/authenticate");



router.get('/',authenticate , contactsControllers.listContacts)

router.get('/:contactId',authenticate,isValidId, contactsControllers.getContactById)

router.post('/',authenticate , contactsControllers.addContact)

router.delete('/:contactId',authenticate, isValidId, contactsControllers.removeContact)

router.put('/:contactId', authenticate, isValidId, contactsControllers.updateContact)

router.patch('/:contactId/favorite',authenticate, isValidId, contactsControllers.updateFavorite)

module.exports = router
