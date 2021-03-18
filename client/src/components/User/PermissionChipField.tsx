import { Chip, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
    main: {
        padding:0,margin:0
    },
    chip: { margin: 3,color:"white",backgroundColor:"#2196f3",fontSize:10,fontWeight:"bold",height:20 },
    outerSimpleField:{paddingTop:3,paddingBottom:3}
});

const PermissionChipField = (props) => {
    const classes = useStyles();
    const {record,permissionList} = props;
    return record&&permissionList ? (<span className={classes.main}>
        <Chip key={record} className={classes.chip} label={
        permissionList.filter((permission)=>permission.key===record)[0].name.replace("_"," ")
    }/></span>) : null;
};

PermissionChipField.defaultProps = {
    addLabel: true,
};

export default PermissionChipField;