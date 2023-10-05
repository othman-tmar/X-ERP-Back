const express = require('express');
const router = express.Router();
const Department=require("../models/department")

// Get departments.
router.get('/', async (req, res, )=> {
    try {
        const departmeents = await Department.find({}, null, { sort: { '_id': -1 } });
                
        res.status(200).json(departmeents);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

});

// Add new department
router.post('/', async (req, res) =>  {
    
    const newDepartment = new Department(req.body)

    try {
        await newDepartment.save();

        res.status(200).json(newDepartment );
    } catch (error) {
        res.status(404).json({ message: error.message });
    }


});

// Search department
router.get('/:departmentId',async(req, res)=>{
    try {
        const dep = await Department.findById(req.params.departmentId);
        
        res.status(200).json(dep);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


// Update department
router.put('/:departmentId', async (req, res)=> {
   try {
    const dep = await Department.findByIdAndUpdate(
        req.params.departmentId,
        { $set: req.body },
      { new: true }
    );
    res.status(200).json(dep);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
});

// Delete department
router.delete('/:departmentId', async (req, res)=> {
    const  id  = req.params.departmentId;
    await Department.findByIdAndDelete(id);

    res.json({ message: "Department deleted successfully." });

});

module.exports = router;