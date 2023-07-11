var config = require ('./databaseconfig');
const sql = require ('mssql/msnodesqlv8');

async function getEmployee(){
    try{
        let pool =await sql.connect(config);
        let emp = await pool.request().query("SELECT * from Employee");
        return emp.recordsets;
    }
    catch(error) {
        console.log(error);

    }
}

async function getEmploye(EmployeeId) {
    try {
        let pool = await sql.connect(config);
        let empz = await pool.request()
            .input('input_parameter', sql.Int, EmployeeId)
            .query("SELECT * from Employee where EmployeeId = @input_parameter");
        return empz.recordsets;

    }
    catch (error) {
        console.log(error);
    }
}

async function addEmploye(Employe, res) {
console.log(Employe);
    try {
        if(Employe.Department){ 
            let pool = await sql.connect(config);
            let insertempz = await pool.request()
                .input('FirstName', sql.NVarChar, Employe.FirstName)
                .input('LastName', sql.NVarChar, Employe.LastName)
                .input('Salary', sql.Int, Employe.Salary)
                .input('JoiningDate', sql.Date, Employe.JoiningDate)
                .input('Department', sql.NVarChar, Employe.Department)
                .execute('InsertEmployee');
            return insertempz.recordsets;
        }else{ 
        res.status(400).send({message : 'Department is required'})
        }
        
    }
    catch (err) {
        console.log(err);
    }

}

async function deleteEmployee(EmployeeId) {
    try {
        let pool = await sql.connect(config);
        let deleteEmp = await pool.request()
            .input('input_parameter', sql.Int, EmployeeId)
            .query("DELETE FROM Employee WHERE EmployeeId = @input_parameter");
        return deleteEmp.rowsAffected;
    } catch (error) {
        console.log(error);
    }
}

async function updateEmployee(EmployeeId, updatedEmployee) {
    try {
        let pool = await sql.connect(config);
        let updateEmp = await pool.request()
            .input('EmployeeId', sql.Int, EmployeeId)
            .input('FirstName', sql.NVarChar, updatedEmployee.FirstName)
            .input('LastName', sql.NVarChar, updatedEmployee.LastName)
            .input('Salary', sql.Int, updatedEmployee.Salary)
            .input('JoiningDate', sql.Date, updatedEmployee.JoiningDate)
            .input('Department', sql.NVarChar, updatedEmployee.Department)
            .query(`UPDATE Employee SET FirstName = @FirstName, LastName = @LastName, Salary = @Salary, JoiningDate = @JoiningDate, Department = @Department WHERE EmployeeId = @EmployeeId`);
        return updateEmp.rowsAffected;
    } catch (error) {
        console.log(error);
    }
}



  async function getEmployee() {
    try {
      let pool = await sql.connect(config);
      let emp = await pool.request().query(`
        select e.*, v.NomVille
        from Employee e
        inner join Employee_Ville ev ON e.EmployeeId = ev.EmployeeId
        inner join Ville v ON ev.VilleId = v.VilleId
      `);
      return emp.recordsets;
    } catch (error) {                                       
      console.log(error);
    }
  }
 
  
  async function getEmployeesByVille(villeId) {
    try {
        let pool = await sql.connect(config);
        let employees = await pool.request()
            .input('villeId', sql.Int, villeId)
            .query('select * from Employee where VilleId = @villeId');
        return employees.recordsets;
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    getEmployee : getEmployee,
    getEmploye : getEmploye ,
    addEmploye : addEmploye ,
    updateEmployee : updateEmployee ,
    deleteEmployee : deleteEmployee,
    getEmployeesByVille : getEmployeesByVille
}