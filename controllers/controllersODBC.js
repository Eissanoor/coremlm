// const odbc = require('odbc');
import odbc from 'odbc';


const FATSDB ={
//get all data
async getAllAssetMasterEncodeAssetCapture(req,res,next){
    try{
        console.log("api")
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblAssetMasterEncodeAssetCapture`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllAssetMasterEncodeAssetCaptureFinal(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblAssetMasterEncodeAssetCaptureFinal`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllEmployeeList(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblEmployeeList `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllNewDepartmentLit(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblNewDepartmentLit`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllusers(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblUsers`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllRegion(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblRegion`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllCity(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblCity`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllCityMaster(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblCityMaster `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllAssetRequestMaster(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblAssetRequestMaster`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllAssetRequestDetails(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblAssetRequestDetails`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllAssetCondition(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblAssetCondition`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllMAINCATEGORY(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblMAINCATEGORY `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllMAINSUBSeriesNo(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblMAINSUBSeriesNo `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllmakelist(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblMakeList `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllMAINSUBSeriesNoAssigned(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblMAINSUBSeriesNoAssigned`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllCountry(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblCountry`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllInvJournalMaster(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblInvJournalMaster`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllLocationTags(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblLocationTags`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllUsersRoles(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblUsersRoles`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllUsersRolesAssigned(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblUsersRolesAssigned `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllUsersDepartment(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblUsersDepartment`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllfloors(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblFloors `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAllassetsphoto(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM TblAssetsPhoto `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
// get by id
async getAssetMasterEncodeAssetCaptureById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAssetMasterEncodeAssetCaptureFinalById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getEmployeeListById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getNewDepartmentLitById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getusersById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getRegionById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getCityById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getCityMasterById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAssetRequestMasterById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAssetRequestDetailsById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getAssetConditionById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getMAINCATEGORYById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getMAINSUBSeriesNoById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getmakelistById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getMAINSUBSeriesNoAssignedById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getCountryById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getInvJournalMasterById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getLocationTagsById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getUsersRolesById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getUsersRolesAssignedById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getUsersDepartmentById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getfloorsById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async getassetsphotoById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
//delete by id
async deleteAssetMasterEncodeAssetCaptureById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteAssetMasterEncodeAssetCaptureFinalById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteEmployeeListById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteNewDepartmentLitById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteusersById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteRegionById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteCityById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteCityMasterById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteAssetRequestMasterById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteAssetRequestDetailsById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteAssetConditionById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteMAINCATEGORYById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteMAINSUBSeriesNoById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deletemakelistById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteMAINSUBSeriesNoAssignedById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteCountryById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteInvJournalMasterById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteLocationTagsById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteUsersRolesById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteUsersRolesAssignedById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteUsersDepartmentById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deletefloorsById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async deleteassetsphotoById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`delete where `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
// post data
async postAssetMasterEncodeAssetCapture(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(` `);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postAssetMasterEncodeAssetCaptureFinal(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postEmployeeList(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postNewDepartmentLit(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postusers(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postRegion(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postCity(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postCityMaster(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postAssetRequestMaster(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postAssetRequestDetails(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postAssetCondition(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postMAINCATEGORY(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postMAINSUBSeriesNo(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postmakelist(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postMAINSUBSeriesNoAssigned(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postCountry(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postInvJournalMaster(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postLocationTags(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postUsersRoles(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postUsersRolesAssigned(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postUsersDepartment(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postfloors(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async postassetsphoto(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
// update by id 
async updateAssetMasterEncodeAssetCaptureById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateAssetMasterEncodeAssetCaptureFinalById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateEmployeeListById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateNewDepartmentLitById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateusersById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateRegionById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateCityById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateCityMasterById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateAssetRequestMasterById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateAssetRequestDetailsById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateAssetConditionById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateMAINCATEGORYById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateMAINSUBSeriesNoById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updatemakelistById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateMAINSUBSeriesNoAssignedById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateCountryById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateInvJournalMasterById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateLocationTagsById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateUsersRolesById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateUsersRolesAssignedById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateUsersDepartmentById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updatefloorsById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
async updateassetsphotoById(req,res,next){
    try{
    const connection = await odbc.connect(`DSN=HFSQL`);
    console.log("connection working ");    
    const data = await connection.query(`SELECT * FROM [purchase_order]`);
    console.log(data);
    return res.send(data); 
    }
    catch(e){
            console.log(e);
            return res.send(e)
    }
 
},
};
export default FATSDB;