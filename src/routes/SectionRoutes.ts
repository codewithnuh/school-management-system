import { SectionController } from '@/controllers/SectionController'
import express from 'express'
const sectionRoutes = express.Router()
sectionRoutes.post('/', SectionController.createSection)
sectionRoutes.get('/class/:classId', SectionController.getAllSections) // Get sections by classId
sectionRoutes.get('/:id', SectionController.getSectionById)
sectionRoutes.put('/:id', SectionController.updateSection)
sectionRoutes.delete('/:id', SectionController.deleteSection)
