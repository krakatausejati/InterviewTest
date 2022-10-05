const { authJwt } = require("../middleware");
const controller = require("../controllers/checklist.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/checklist", 
    [authJwt.verifyToken],
    controller.getChecklist
  );

  app.post(
    "/checklist",
    [authJwt.verifyToken],
    controller.createChecklist
  );

  app.delete(
    "/checklist/:checklistId",    
    [authJwt.verifyToken],
    controller.deleteChecklist
  )
};