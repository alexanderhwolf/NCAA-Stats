// The 16 Big 12 schools and the sports each one sponsors.
// Generated from the Oct 21, 2026 snapshot; edit by hand from here on.
//
// layer "espn": results come from ESPN's site JSON (see src/espn.js).
// layer "site": results come from the school's own Sidearm text-only schedule page (src/sidearm.js).
// platform "unsupported": the school site isn't Sidearm, so its "site" sports show as unavailable for now.
// espnId: ESPN's team id. VERIFY with /probe before trusting (see README). Soccer may use a separate id space.
// A slug shared by men's and women's entries (key "slug:m" / "slug:w") is one combined page; the parser splits rows by gender markers.

export const SCHOOLS = [
  {
    "id": "arizona",
    "name": "Arizona",
    "nickname": "Wildcats",
    "short": "ARIZ",
    "bg": "#0C234B",
    "ink": "#ffffff",
    "domain": "arizonawildcats.com",
    "platform": "sidearm",
    "espnId": 12,
    "sports": [
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-swimming-and-diving",
        "slug": "mens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-tennis",
        "slug": "mens-tennis",
        "name": "Tennis",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "womens-beach-volleyball",
        "slug": "womens-beach-volleyball",
        "name": "Beach Volleyball",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-gymnastics",
        "slug": "womens-gymnastics",
        "name": "Gymnastics",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-swimming-and-diving",
        "slug": "womens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "cross-country",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-and-field",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "triathlon",
        "slug": "triathlon",
        "name": "Triathlon",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "arizona-state",
    "name": "Arizona State",
    "nickname": "Sun Devils",
    "short": "ASU",
    "bg": "#8C1D40",
    "ink": "#ffffff",
    "domain": "thesundevils.com",
    "platform": "unsupported",
    "espnId": 9,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "volleyball",
        "slug": "volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "cross-country",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "ice-hockey",
        "slug": "ice-hockey",
        "name": "Ice Hockey",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "mens-swimming-diving",
        "slug": "mens-swimming-diving",
        "name": "Swimming & Diving",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-swimming-diving",
        "slug": "womens-swimming-diving",
        "name": "Swimming & Diving",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "triathlon",
        "slug": "triathlon",
        "name": "Triathlon",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-tennis",
        "slug": "mens-tennis",
        "name": "Tennis",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "gymnastics",
        "slug": "gymnastics",
        "name": "Gymnastics",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "wrestling",
        "slug": "wrestling",
        "name": "Wrestling",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "lacrosse",
        "slug": "lacrosse",
        "name": "Lacrosse",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "beach-volleyball",
        "slug": "beach-volleyball",
        "name": "Beach Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "water-polo",
        "slug": "water-polo",
        "name": "Water Polo",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "track-field",
        "slug": "track-field",
        "name": "Track & Field",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "baylor",
    "name": "Baylor",
    "nickname": "Bears",
    "short": "BAY",
    "bg": "#154734",
    "ink": "#ffffff",
    "domain": "baylorbears.com",
    "platform": "sidearm",
    "espnId": 239,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "cross-country:m",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country:w",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "equestrian",
        "slug": "equestrian",
        "name": "Equestrian",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "mens-tennis",
        "slug": "mens-tennis",
        "name": "Tennis",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "track-and-field",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "acrobatics-tumbling",
        "slug": "acrobatics-tumbling",
        "name": "Acrobatics & Tumbling",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      }
    ]
  },
  {
    "id": "byu",
    "name": "BYU",
    "nickname": "Cougars",
    "short": "BYU",
    "bg": "#002E5D",
    "ink": "#ffffff",
    "domain": "byucougars.com",
    "platform": "sidearm",
    "espnId": 252,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "mens-cross-country",
        "slug": "mens-cross-country",
        "name": "Cross Country",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-cross-country",
        "slug": "womens-cross-country",
        "name": "Cross Country",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-volleyball",
        "slug": "mens-volleyball",
        "name": "Volleyball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-volleyball"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "womens-gymnastics",
        "slug": "womens-gymnastics",
        "name": "Gymnastics",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "mens-swimming-and-diving",
        "slug": "mens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-swimming-and-diving",
        "slug": "womens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-tennis",
        "slug": "mens-tennis",
        "name": "Tennis",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-track-and-field",
        "slug": "mens-track-and-field",
        "name": "Track & Field",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-track-and-field",
        "slug": "womens-track-and-field",
        "name": "Track & Field",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "ucf",
    "name": "UCF",
    "nickname": "Knights",
    "short": "UCF",
    "bg": "#000000",
    "ink": "#FFC904",
    "domain": "ucfknights.com",
    "platform": "sidearm",
    "espnId": 2116,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "volleyball",
        "slug": "volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "mens-soccer",
        "slug": "mens-soccer",
        "name": "Soccer",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-soccer"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "cross-country",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "mens-tennis",
        "slug": "mens-tennis",
        "name": "Tennis",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "track-and-field",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "rowing",
        "slug": "rowing",
        "name": "Rowing",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "cincinnati",
    "name": "Cincinnati",
    "nickname": "Bearcats",
    "short": "CIN",
    "bg": "#C8102E",
    "ink": "#ffffff",
    "domain": "gobearcats.com",
    "platform": "sidearm",
    "espnId": 2132,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "womens-lacrosse",
        "slug": "womens-lacrosse",
        "name": "Lacrosse",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country:m",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country:w",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "swimming-and-diving",
        "slug": "swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Coed",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "track-field:m",
        "slug": "track-field",
        "name": "Track & Field",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-field:w",
        "slug": "track-field",
        "name": "Track & Field",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "colorado",
    "name": "Colorado",
    "nickname": "Buffaloes",
    "short": "COLO",
    "bg": "#000000",
    "ink": "#CFB87C",
    "domain": "cubuffs.com",
    "platform": "sidearm",
    "espnId": 38,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "cross-country",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-lacrosse",
        "slug": "womens-lacrosse",
        "name": "Lacrosse",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "skiing",
        "slug": "skiing",
        "name": "Skiing",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "track-and-field",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "houston",
    "name": "Houston",
    "nickname": "Cougars",
    "short": "HOU",
    "bg": "#C8102E",
    "ink": "#ffffff",
    "domain": "uhcougars.com",
    "platform": "sidearm",
    "espnId": 248,
    "sports": [
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "cross-country",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "womens-swimming-and-diving",
        "slug": "womens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-and-field",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      }
    ]
  },
  {
    "id": "iowa-state",
    "name": "Iowa State",
    "nickname": "Cyclones",
    "short": "ISU",
    "bg": "#9E1B32",
    "ink": "#F1BE48",
    "domain": "cyclones.com",
    "platform": "sidearm",
    "espnId": 66,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "cross-country:m",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country:w",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "golf",
        "slug": "golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "wrestling",
        "slug": "wrestling",
        "name": "Wrestling",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "track-and-field:m",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-and-field:w",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "womens-gymnastics",
        "slug": "womens-gymnastics",
        "name": "Gymnastics",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-swimming-and-diving",
        "slug": "womens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "kansas",
    "name": "Kansas",
    "nickname": "Jayhawks",
    "short": "KU",
    "bg": "#0051BA",
    "ink": "#ffffff",
    "domain": "kuathletics.com",
    "platform": "sidearm",
    "espnId": 2305,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "womens-rowing",
        "slug": "womens-rowing",
        "name": "Rowing",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-swimming-and-diving",
        "slug": "womens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country:m",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country:w",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-and-field:m",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-and-field:w",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "kansas-state",
    "name": "Kansas State",
    "nickname": "Wildcats",
    "short": "KSU",
    "bg": "#512888",
    "ink": "#ffffff",
    "domain": "kstatesports.com",
    "platform": "sidearm",
    "espnId": 2306,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-rowing",
        "slug": "womens-rowing",
        "name": "Rowing",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country:m",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country:w",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-and-field:m",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-and-field:w",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "oklahoma-state",
    "name": "Oklahoma State",
    "nickname": "Cowboys & Cowgirls",
    "short": "OKST",
    "bg": "#FF7300",
    "ink": "#000000",
    "domain": "okstate.com",
    "platform": "sidearm",
    "espnId": 197,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "equestrian",
        "slug": "equestrian",
        "name": "Equestrian",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mxct",
        "slug": "mxct",
        "name": "Cross Country & Track",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-cross-country-track",
        "slug": "womens-cross-country-track",
        "name": "Cross Country & Track",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-tennis",
        "slug": "mens-tennis",
        "name": "Tennis",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "wrestling",
        "slug": "wrestling",
        "name": "Wrestling",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      }
    ]
  },
  {
    "id": "tcu",
    "name": "TCU",
    "nickname": "Horned Frogs",
    "short": "TCU",
    "bg": "#4D1979",
    "ink": "#ffffff",
    "domain": "gofrogs.com",
    "platform": "sidearm",
    "espnId": 2628,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "equestrian",
        "slug": "equestrian",
        "name": "Equestrian",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-rifle",
        "slug": "womens-rifle",
        "name": "Rifle",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "swimming-and-diving:w",
        "slug": "swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "swimming-and-diving:m",
        "slug": "swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "cross-country:m",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country:w",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "triathlon",
        "slug": "triathlon",
        "name": "Triathlon",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "womens-beach-volleyball",
        "slug": "womens-beach-volleyball",
        "name": "Beach Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "mens-tennis",
        "slug": "mens-tennis",
        "name": "Tennis",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "track-and-field:m",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-and-field:w",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "texas-tech",
    "name": "Texas Tech",
    "nickname": "Red Raiders",
    "short": "TTU",
    "bg": "#CC0000",
    "ink": "#ffffff",
    "domain": "texastech.com",
    "platform": "sidearm",
    "espnId": 2641,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-golf",
        "slug": "womens-golf",
        "name": "Golf",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-tennis",
        "slug": "mens-tennis",
        "name": "Tennis",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "cross-country",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "track-and-field",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      }
    ]
  },
  {
    "id": "utah",
    "name": "Utah",
    "nickname": "Utes",
    "short": "UTAH",
    "bg": "#BE0000",
    "ink": "#ffffff",
    "domain": "utahutes.com",
    "platform": "sidearm",
    "espnId": 254,
    "sports": [
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "cross-country",
        "slug": "cross-country",
        "name": "Cross Country",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-swimming-and-diving",
        "slug": "mens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "softball",
        "slug": "softball",
        "name": "Softball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "softball"
      },
      {
        "key": "womens-gymnastics",
        "slug": "womens-gymnastics",
        "name": "Gymnastics",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "mens-tennis",
        "slug": "mens-tennis",
        "name": "Tennis",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-swimming-and-diving",
        "slug": "womens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "track-and-field",
        "slug": "track-and-field",
        "name": "Track & Field",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-lacrosse",
        "slug": "mens-lacrosse",
        "name": "Lacrosse",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "ski",
        "slug": "ski",
        "name": "Skiing",
        "g": "Coed",
        "kind": "meet",
        "layer": "site"
      }
    ]
  },
  {
    "id": "west-virginia",
    "name": "West Virginia",
    "nickname": "Mountaineers",
    "short": "WVU",
    "bg": "#002855",
    "ink": "#EAAA00",
    "domain": "wvusports.com",
    "platform": "sidearm",
    "espnId": 277,
    "sports": [
      {
        "key": "baseball",
        "slug": "baseball",
        "name": "Baseball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "baseball"
      },
      {
        "key": "mens-basketball",
        "slug": "mens-basketball",
        "name": "Basketball",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-basketball"
      },
      {
        "key": "football",
        "slug": "football",
        "name": "Football",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "football"
      },
      {
        "key": "mens-golf",
        "slug": "mens-golf",
        "name": "Golf",
        "g": "Men",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "mens-soccer",
        "slug": "mens-soccer",
        "name": "Soccer",
        "g": "Men",
        "kind": "h2h",
        "layer": "espn",
        "espn": "mens-soccer"
      },
      {
        "key": "mens-swimming-and-diving",
        "slug": "mens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "wrestling",
        "slug": "wrestling",
        "name": "Wrestling",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-basketball",
        "slug": "womens-basketball",
        "name": "Basketball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-basketball"
      },
      {
        "key": "womens-cross-country",
        "slug": "womens-cross-country",
        "name": "Cross Country",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-gymnastics",
        "slug": "womens-gymnastics",
        "name": "Gymnastics",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-rowing",
        "slug": "womens-rowing",
        "name": "Rowing",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-soccer",
        "slug": "womens-soccer",
        "name": "Soccer",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-soccer"
      },
      {
        "key": "womens-swimming-and-diving",
        "slug": "womens-swimming-and-diving",
        "name": "Swimming & Diving",
        "g": "Women",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "womens-tennis",
        "slug": "womens-tennis",
        "name": "Tennis",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-track-and-field",
        "slug": "womens-track-and-field",
        "name": "Track & Field",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "womens-volleyball",
        "slug": "womens-volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "rifle",
        "slug": "rifle",
        "name": "Rifle",
        "g": "Coed",
        "kind": "h2h",
        "layer": "site"
      }
    ]
  }
];

export const BY_ID = Object.fromEntries(SCHOOLS.map(s => [s.id, s]));
