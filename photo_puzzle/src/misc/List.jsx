import ClickPic from "../components/ClickPic";
import PhotoPuzzle from "../components/PhotoPuzzle";
import PhotoWithFilters from "../components/PhotoWithFilters";
import VideoRecord from "../components/VideoRecord";

const list = {
    // "FirstPhoto": {
    //     name: "First Cam No Filter",
    //     component: <ClickPic/>
    // },
    // "FirstVideo":{
    //     name: "First Video No Filter",
    //     component: <VideoRecord/>
    // },
    "PhotoPuzzle":{
        "name": "Photo Puzzle",
        component: <PhotoPuzzle/>
    },
    "PhotoWithFilters":{
        "name": "Photo Cards",
        component: <PhotoWithFilters/>
    }
};

export default list;