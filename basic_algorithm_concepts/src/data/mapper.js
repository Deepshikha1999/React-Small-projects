import BubbleSort from "../components/BubbleSort.jsx";
import BinarySearch from "../components/BinarySearch";
import LinearSearch from "../components/LinearSearch";
import SelectionSort from "../components/SelectionSort.jsx";
import InsertionSort from "../components/InsertionSort.jsx";
import CountSort from "../components/CountSort.jsx";
import NaiveStringMatching from "../components/NaiveStringMatching.jsx";
import PrefixSum from "../components/PrefixSum.jsx";
import SlidingWindow from "../components/SlidingWindow.jsx";
import Recursion from "../components/Recursion.jsx";
import IterativeSubdivision from "../components/IterativeSubdivision.jsx";
import Matrix from "../components/Matrix.jsx";
import Queue from "../components/Queue.jsx";
import Stack from "../components/Stack.jsx";
import HashingLookUp from "../components/HashingLookUp.jsx";
import Pallindrome from "../components/Pallindrome.jsx";
import MergeSort from "../components/MergeSort.jsx";
import QuickSort from "../components/QuickSort.jsx";

const algo_helper = {
    "LinearSearch":{
        "name": "Linear Search",
        "component": LinearSearch
    },
    "BinarySearch":{
        "name": "Binary Search",
        "component": BinarySearch
    },
    "BubbleSort":{
        "name":"Bubble Sort",
        "component": BubbleSort
    },
    "SelectionSort":{
        "name":"Selection Sort",
        "component":SelectionSort
    },
    "InsertionSort":{
        "name":"Insertion Sort",
        "component":InsertionSort
    },
    "CountSort":{
        "name":"Count Sort",
        "component": CountSort
    },
    "NaiveStringMatching":{
        "name":"Naive String Matching",
        "component": NaiveStringMatching
    },
    "PrefixSum":{
        "name" : "Prefix Sum",
        "component": PrefixSum
    },
    "SlidingWindow":{
        "name": "Sliding Window",
        "component": SlidingWindow
    },
    "Recursion":{
        "name":"Recursion",
        "component": Recursion
    },
    "IterativeSubdivision":{
        "name": "Iterative Subdivision",
        "component" : IterativeSubdivision
    },
    "Matrix":{
        "name": "Matrix",
        "component": Matrix
    },
    "Queue":{
        "name": "Queue",
        "component": Queue
    },
    "Stack":{
        "name": "Stack",
        "component": Stack
    },
    "Hashing":{
        "name": "Hashing Lookup",
        "component": HashingLookUp
    },
    "Pallindrome":{
        "name": "Pallindrome",
        "component": Pallindrome
    },
    "MergeSort":{
        "name": "Merge Sort",
        "component": MergeSort
    },
    "QuickSort":{
        "name": "Quick Sort",
        "component" : QuickSort
    }
}

export default algo_helper;