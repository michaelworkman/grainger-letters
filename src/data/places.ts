export interface Place {
  name: string;
  lat: number;
  lng: number;
  period: string;
  note: string;
}

export const places: Place[] = [
  { name: "Lexington, Virginia", lat: 37.784, lng: -79.443, period: "1962–1993", note: "Home base for thirty years. 313 Jackson Ave — the beloved farmhouse. Inslee taught at W&L. Alice purchased the house in 1993." },
  { name: "Arlington, Virginia", lat: 38.882, lng: -77.091, period: "1963", note: "Pixie finished high school here, staying with the Frith family while the rest of the family settled in Lexington." },
  { name: "Harrisonburg, Virginia", lat: 38.446, lng: -78.870, period: "1963–1965", note: "Madison College — where Penny earned her Music Education degree in 1965." },
  { name: "Chatham, Virginia", lat: 36.826, lng: -79.398, period: "1969", note: "Pix and Jim Workman lived here, just 1.5 hours from Chapel Hill." },
  { name: "Hot Springs, Virginia", lat: 37.999, lng: -79.832, period: "1991", note: "The Homestead resort — site of the American celebration welcoming Alice and Patrick as newlyweds." },
  { name: "Fort Lee, Virginia", lat: 37.229, lng: -77.345, period: "1966–1967", note: "Penny and Tom Adams's first Army posting. Penny taught third grade." },
  { name: "Petersburg, Virginia", lat: 37.228, lng: -77.402, period: "1967–1968", note: "Penny taught second grade here during Tom's Vietnam deployment." },
  { name: "Newport News, Virginia", lat: 37.087, lng: -76.473, period: "1968–1969", note: "Pix and Jim Workman's first home after returning from Germany." },
  { name: "Virginia Beach, Virginia", lat: 36.852, lng: -75.979, period: "1965–1966", note: "Penny taught music at Trantwood Elementary School, with eleven piano students after school." },
  { name: "Richmond, Virginia", lat: 37.541, lng: -77.436, period: "1970–1993", note: "Pixie and Jim Workman's home for twenty years, on Kenmore Road." },
  { name: "Roanoke, Virginia", lat: 37.264, lng: -80.014, period: "1989–1999", note: "Penny and Tom settled here. Inslee and Eleanor moved to Brandon Oaks Sept 24, 1993." },
  { name: "Chapel Hill, North Carolina", lat: 35.905, lng: -79.047, period: "1964–1973", note: "Inslee earned his PhD here May 13, 1973. Mike Workman graduated here May 1994. Four generations at UNC." },
  { name: "High Point, North Carolina", lat: 35.972, lng: -79.996, period: "1970–1980", note: "Inslee headed the Modern Language Department at High Point College." },
  { name: "Durham, North Carolina", lat: 36.001, lng: -78.938, period: "1975–1979", note: "Duke University — Alice attended on an Angier B. Duke Scholarship." },
  { name: "Winston-Salem, North Carolina", lat: 36.095, lng: -80.243, period: "1973", note: "Alice attended a three-week forensics workshop at Wake Forest University." },
  { name: "Montreat, North Carolina", lat: 35.647, lng: -82.300, period: "1983–1999", note: "Site of the Global Mission Conference, attended multiple times across the 1980s and 1990s." },
  { name: "Burnsville, North Carolina", lat: 35.917, lng: -82.301, period: "1984–1989", note: "Home of the Secrets — dear friends whose mountain cabin provided vacation." },
  { name: "Fort Dix, New Jersey", lat: 40.030, lng: -74.618, period: "1970", note: "Mike Adams born here September 23, 1970. Eleanor made an overnight train journey to greet him." },
  { name: "Quarryville, Pennsylvania", lat: 39.897, lng: -76.164, period: "1968–1979", note: "Mother Grainger moved to the Presbyterian Home here at age 88. She lived to nearly 100." },
  { name: "Frederick, Maryland", lat: 39.414, lng: -77.411, period: "1978–1983", note: "Adams family home after Belgium — Tom stationed at Fort Detrick." },
  { name: "San Antonio, Texas", lat: 29.425, lng: -98.495, period: "1969", note: "Penny and Tom posted here for a six-month Army Career School." },
  { name: "Fort Defiance, Arizona", lat: 35.744, lng: -109.076, period: "1983–1985", note: "Alice worked as an OB nurse at the Navajo Indian Hospital." },
  { name: "Würzburg, Germany", lat: 49.791, lng: 9.953, period: "1967–1968", note: "Jim Workman's Army posting. Pixie joined him after their April 1967 wedding." },
  { name: "Nürnberg, Germany", lat: 49.454, lng: 11.075, period: "1983–1986", note: "Adams family posting — Tom's final Germany tour." },
  { name: "Brussels, Belgium", lat: 50.848, lng: 4.357, period: "1975–1978", note: "Tom was Personnel Officer at SHAPE. Meredith (Mimi) born here July 1976." },
  { name: "Oxford, United Kingdom", lat: 51.752, lng: -1.258, period: "1978", note: "Alice spent seven weeks studying here on a scholarship during her Duke years." },
  { name: "Saint-Lô, France", lat: 49.115, lng: -1.083, period: "1999", note: "Roanoke's sister city in Normandy. Inslee traveled here in June 1999." },
  { name: "Kuwait City, Kuwait", lat: 29.378, lng: 47.975, period: "1991", note: "Patrick Gasser's ICRC posting when he and Alice married." },
  { name: "Lungern, Switzerland", lat: 46.786, lng: 8.160, period: "1991", note: "Alice and Patrick married here April 5, 1991. Patrick's family hometown." },
  { name: "Geneva, Switzerland", lat: 46.204, lng: 6.143, period: "1994–1999", note: "Alice and Patrick's home after evacuation from Rwanda. Patrick worked at ICRC HQ." },
  { name: "Nyon, Switzerland", lat: 46.383, lng: 6.235, period: "1999–", note: "Alice and Patrick's final home. Patrick worked for UEFA. Joseph in school." },
  { name: "Zagreb, Croatia", lat: 45.815, lng: 15.982, period: "1991–1993", note: "Alice and Patrick posted here during the Yugoslav wars." },
  { name: "Split, Croatia", lat: 43.515, lng: 16.444, period: "1993", note: "Patrick established ICRC leadership here. Pixie brought baby Joseph to Patrick in Split." },
  { name: "Lahore, Pakistan", lat: 31.520, lng: 74.359, period: "1978", note: "Alice spent a semester here studying the Urdu language on an HEW grant." },
  { name: "Mekele, Ethiopia", lat: 13.496, lng: 39.474, period: "1985–1986", note: "Alice's 1985 assignment — a three-tent hospital. 'We haven't yet found it on the map.'" },
  { name: "Kassala, Sudan", lat: 15.457, lng: 36.404, period: "1986–1988", note: "Alice lived in a tukul hut near the Blue Nile. 110–130°F. Eritrean refugees." },
  { name: "Kigali, Rwanda", lat: -1.944, lng: 30.062, period: "1993–1994", note: "Alice and baby Joseph evacuated by plane April 1994 ahead of the genocide." },
];
