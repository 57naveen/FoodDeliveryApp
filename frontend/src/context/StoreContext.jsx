import axios from "axios";
import { createContext,useEffect,useState } from "react";
// import { food_list } from "../assets/assets";

export const  StoreContext = createContext(null)


const StoreContextProvider = (props)=>{

  const [cartItems,setCartItems] = useState({});

  const url = "https://food-del-backend-k759.onrender.com"
  const [token,setToken]=useState("")

  const [food_list,setFood_list] = useState([])

    const addToCart = async (itemId) =>{
      if(!cartItems[itemId])
      {
          setCartItems((prev)=>({...prev,[itemId]:1}))
      }
      else {  
          setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
      }
      if(token){
          await axios.post(url + "/api/cart/add",{itemId},{headers:{token}})
      }
    }


    const removefromCart =async (itemId)=>{
      setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
      if(token){
        await axios.post(url + "/api/cart/remove",{itemId},{headers:{token}})
    }
    }

    const getTotalCartAmount = () =>{
      let totalAmount = 0;
      for(const item in cartItems)
      {
        if(cartItems[item]>0){
          let itemInfo = food_list.find((product)=>product._id === item);
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
      return totalAmount
    }


    const fetchFoodList = async () =>{
      const response = await axios.get(url+"/api/food/list");
      setFood_list(response.data.data)
    }

    const loadCartData = async (token)=>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}})
        setCartItems(response.data.cartData)
    }

    // this stop prevent from logout whenever page get refershed
    useEffect(()=>{
        if(localStorage.getItem("token"))
        {
          setToken(localStorage.getItem("token"));
        }
        async function loadData(){
          await fetchFoodList();
          if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"))
            await loadCartData (localStorage.getItem("token"));
          }
        }
        loadData();
    },[])


  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removefromCart,
    getTotalCartAmount,
    url,
    token,
    setToken

  }
  return(
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )

}

export default StoreContextProvider
