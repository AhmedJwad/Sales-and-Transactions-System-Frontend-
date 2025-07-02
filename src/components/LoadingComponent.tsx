import { CircularProgress } from "@mui/material"
import { Box } from "@mui/system"


const LoadingComponent=()=>{
    return (
       <Box
        sx={{
            width:"100%",
            height: "400",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            }}>
                <CircularProgress/>
        </Box>
    )
}

export default LoadingComponent;