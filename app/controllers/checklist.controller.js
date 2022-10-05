const ResponseClass = require("../models/response")
const Pool = require("pg").Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api_management',
    password: 'postgres',
    port: 5432
});

const getChecklist = (request, response) => {
    var responseReturn = new ResponseClass();
    pool.query('SELECT * FROM checklist ORDER BY checklist_id ASC', (error, results) => {
        if (error) {
            console.log("fail");
            throw error
        }
        console.log("success");
        responseReturn.status = true;
        responseReturn.code = 200;
        responseReturn.message = "Success";
        responseReturn.data = results.rows;

        response.status(200).json(responseReturn);
    })
}

const getChecklistById = (request, response) => {
    var responseReturn = new ResponseClass();
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM checklist WHERE checklist_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        if (results.rowCount == 0) {
            responseReturn.status = true;
            responseReturn.code = 404;
            responseReturn.message = "User not found";
            responseReturn.data = null;
        } else {
            responseReturn.status = true;
            responseReturn.code = 200;
            responseReturn.message = "Success";
            responseReturn.data = results.rows[0];
        }
        response.status(200).json(responseReturn);
    })
}

const createChecklist = (request, response) => {
    const {checklist_id, name} = request.body;
    //checklist_id should be auto increment
    pool.query('INSERT INTO checklist (checklist_id, name) VALUES ($1, $2)', [checklist_id, name], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send("Checklist added");
    })
}

const updateChecklist = (request, response) => {
    const id = parseInt(request.params.id);
    var responseReturn = new ResponseClass();
    try {
        const { checklist_id , name} = request.body;
        pool.query('UPDATE checklist SET name = $1 WHERE id_project = $2', [name, checklist_id], (error, results) => {
            if (error) {
                throw error
            }

            responseReturn.status = true;
            responseReturn.code = 200;
            responseReturn.message = "User modification successed";
            responseReturn.data = null;
            response.status(200).send(responseReturn);
        })
    } catch (error) {
        responseReturn.status = false;
        responseReturn.code = 500;
        responseReturn.message = error.message;
        responseReturn.data = null
        response.status(500).json(responseReturn);
    }
}

const deleteChecklist = (request, response) => {
    const id = parseInt(request.params.checklistId)
    pool.query('DELETE FROM checklist WHERE checklist_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send("Checklist deleted");
    })
}

module.exports = {
    getChecklist,
    getChecklistById,
    createChecklist,
    updateChecklist,
    deleteChecklist
}