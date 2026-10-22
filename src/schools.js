// The Big 12 schools (current 16, plus former members for past seasons) and the sports each one sponsors.
// Generated from the Oct 21, 2026 snapshot; edit by hand from here on.
//
// layer "espn": results come from ESPN's site JSON (see src/espn.js).
// layer "site": results come from the school's own Sidearm text-only schedule page (src/sidearm.js).
// platform "unsupported": no text-only schedule pages, so its "site" sports show as unavailable for now.
//   Arizona State isn't Sidearm; BYU, UCF and Cincinnati return 404 for /schedule/text (checked from the
//   Worker, Oct 21, 2026). Their ESPN sports still load.
// espnId: ESPN's team id for every ESPN sport except soccer, which has its own id space
// (espnSoccerW / espnSoccerM). All verified by team name through /probe on Oct 21, 2026.
// A slug shared by men's and women's entries (key "slug:m" / "slug:w") is one combined page; the parser splits rows by gender markers.

export const SCHOOLS = [
  {
    "id": "arizona",
    "espnSoccerW": "20503",
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
    "espnSoccerW": "20529",
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
    "espnSoccerW": "20522",
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
    "espnSoccerW": "20516",
    "name": "BYU",
    "nickname": "Cougars",
    "short": "BYU",
    "bg": "#002E5D",
    "ink": "#ffffff",
    "domain": "byucougars.com",
    "platform": "unsupported",
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
    "espnSoccerW": "20504",
    "espnSoccerM": "5830",
    "name": "UCF",
    "nickname": "Knights",
    "short": "UCF",
    "bg": "#000000",
    "ink": "#FFC904",
    "domain": "ucfknights.com",
    "platform": "unsupported",
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
    "espnSoccerW": "20392",
    "name": "Cincinnati",
    "nickname": "Bearcats",
    "short": "CIN",
    "bg": "#C8102E",
    "ink": "#ffffff",
    "domain": "gobearcats.com",
    "platform": "unsupported",
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
    "espnSoccerW": "20528",
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
    "espnSoccerW": "20610",
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
    "espnSoccerW": "20535",
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
    "espnSoccerW": "20494",
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
    "espnSoccerW": "18357",
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
    "espnSoccerW": "20501",
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
    "espnSoccerW": "20518",
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
    "espnSoccerW": "20540",
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
    "espnSoccerW": "20520",
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
    "espnSoccerW": "20382",
    "espnSoccerM": "5658",
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
  },
  // Former members, for past seasons only (members through 2023-24; both left for the SEC).
  // ESPN ids and women's soccer ids checked by team name through /probe, Oct 21, 2026; slugs from
  // each site's sports menu the same day. Texas cross country has no slug of its own there.
  {
    "id": "texas",
    "espnSoccerW": "20517",
    "name": "Texas",
    "nickname": "Longhorns",
    "short": "TEX",
    "bg": "#BF5700",
    "ink": "#ffffff",
    "domain": "texaslonghorns.com",
    "platform": "sidearm",
    "espnId": 251,
    "joined": 1996,
    "lastYear": 2023,
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
        "key": "mens-swimming-and-diving",
        "slug": "mens-swimming-and-diving",
        "name": "Swimming & Diving",
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
        "key": "womens-rowing",
        "slug": "womens-rowing",
        "name": "Rowing",
        "g": "Women",
        "kind": "meet",
        "layer": "site"
      },
      {
        "key": "wbvball",
        "slug": "wbvball",
        "name": "Beach Volleyball",
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
    "id": "oklahoma",
    "espnSoccerW": "20490",
    "name": "Oklahoma",
    "nickname": "Sooners",
    "short": "OU",
    "bg": "#841617",
    "ink": "#ffffff",
    "domain": "soonersports.com",
    "platform": "sidearm",
    "espnId": 201,
    "joined": 1996,
    "lastYear": 2023,
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
        "key": "volleyball",
        "slug": "volleyball",
        "name": "Volleyball",
        "g": "Women",
        "kind": "h2h",
        "layer": "espn",
        "espn": "womens-volleyball"
      },
      {
        "key": "soccer",
        "slug": "soccer",
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
        "key": "mens-gymnastics",
        "slug": "mens-gymnastics",
        "name": "Gymnastics",
        "g": "Men",
        "kind": "h2h",
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
        "key": "wrestling",
        "slug": "wrestling",
        "name": "Wrestling",
        "g": "Men",
        "kind": "h2h",
        "layer": "site"
      },
      {
        "key": "rowing",
        "slug": "rowing",
        "name": "Rowing",
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
  }
];

export const BY_ID = Object.fromEntries(SCHOOLS.map(s => [s.id, s]));

// TFRRS team slugs (cross country), as they appear on the 2025 Big 12 Cross Country
// Championships results page (tfrrs.org/results/xc/27247), checked Oct 21, 2026. Only the
// genders each school runs: UCF, Utah and West Virginia have women's teams only.
const TFRRS = {
  arizona: ["AZ_college_m_Arizona", "AZ_college_f_Arizona"], "arizona-state": ["AZ_college_m_Arizona_State", "AZ_college_f_Arizona_State"],
  baylor: ["TX_college_m_Baylor", "TX_college_f_Baylor"], byu: ["UT_college_m_BYU", "UT_college_f_BYU"], ucf: [null, "FL_college_f_Central_Florida"],
  cincinnati: ["OH_college_m_Cincinnati", "OH_college_f_Cincinnati"], colorado: ["CO_college_m_Colorado", "CO_college_f_Colorado"],
  houston: ["TX_college_m_Houston", "TX_college_f_Houston"], "iowa-state": ["IA_college_m_Iowa_State", "IA_college_f_Iowa_State"],
  kansas: ["KS_college_m_Kansas", "KS_college_f_Kansas"], "kansas-state": ["KS_college_m_Kansas_State", "KS_college_f_Kansas_State"],
  "oklahoma-state": ["OK_college_m_Oklahoma_State", "OK_college_f_Oklahoma_State"], tcu: ["TX_college_m_TCU", "TX_college_f_TCU"],
  "texas-tech": ["TX_college_m_Texas_Tech", "TX_college_f_Texas_Tech"], utah: [null, "UT_college_f_Utah"], "west-virginia": [null, "WV_college_f_West_Virginia"],
};
for (const s of SCHOOLS) if (TFRRS[s.id]) s.tfrrs = { Men: TFRRS[s.id][0], Women: TFRRS[s.id][1] };

// Tennis and beach volleyball are dual-match sports with a team W-L record (spring), not meets.
for (const s of SCHOOLS) for (const sp of s.sports) if (sp.name === "Tennis" || sp.name === "Beach Volleyball") sp.kind = "h2h";

// Big 12 membership by academic start year (2016 = 2016-17). Joined: first season as a member.
// TCU and West Virginia joined for 2012-13; BYU, Cincinnati, Houston and UCF for 2023-24;
// Arizona, Arizona State, Colorado and Utah for 2024-25; Texas and Oklahoma's last season was 2023-24.
const JOINED = { tcu: 2012, "west-virginia": 2012, byu: 2023, cincinnati: 2023, houston: 2023, ucf: 2023,
  arizona: 2024, "arizona-state": 2024, colorado: 2024, utah: 2024 };
for (const s of SCHOOLS) s.joined ??= JOINED[s.id] ?? 1996;
export const memberIn = (school, Y) => Y >= school.joined && (school.lastYear == null || Y <= school.lastYear);
export const membersIn = Y => SCHOOLS.filter(s => memberIn(s, Y));
// How far back the year selector goes.
export const HISTORY_YEARS = 10;

// College baseball and softball have their own ESPN id spaces (football's 197 is Oklahoma State;
// baseball's 197 is Missouri State). Ids from ESPN's team lists, matched by name, Oct 21, 2026.
const ESPN_BASEBALL = {"arizona": 60, "arizona-state": 59, "baylor": 121, "byu": 127, "ucf": 160, "cincinnati": 161, "colorado": 334, "houston": 124, "iowa-state": 373, "kansas": 168, "kansas-state": 264, "oklahoma-state": 110, "tcu": 198, "texas-tech": 201, "utah": 128, "west-virginia": 136, "texas": 126, "oklahoma": 112};
const ESPN_SOFTBALL = {"arizona": 472, "arizona-state": 471, "baylor": 533, "byu": 539, "ucf": 572, "cincinnati": 573, "colorado": 688, "houston": 536, "iowa-state": 727, "kansas": 580, "kansas-state": 627, "oklahoma-state": 522, "tcu": 610, "texas-tech": 613, "utah": 540, "west-virginia": 548, "texas": 538, "oklahoma": 524};

// Does an ESPN team name belong to this school? "Kansas State Wildcats" is not Kansas, and
// "Texas Southern Tigers" is not Texas: the name must start with the school's and the rest must
// share a word with its nickname ("Oklahoma State Cowgirls" matches "Cowboys & Cowgirls").
export function teamMatches(school, teamName) {
  if (!teamName) return true;
  const n = String(teamName);
  if (!n.startsWith(school.name + " ")) return false;
  const rest = new Set(n.slice(school.name.length + 1).toLowerCase().split(/\s+/));
  return school.nickname.toLowerCase().split(/[\s&]+/).filter(Boolean).some(w => rest.has(w));
}

// The ESPN team id this school uses for a given ESPN sport key.
export function espnTeamId(school, espnSport) {
  if (espnSport === "womens-soccer") return school.espnSoccerW;
  if (espnSport === "mens-soccer") return school.espnSoccerM;
  if (espnSport === "baseball") return ESPN_BASEBALL[school.id] != null ? String(ESPN_BASEBALL[school.id]) : null;
  if (espnSport === "softball") return ESPN_SOFTBALL[school.id] != null ? String(ESPN_SOFTBALL[school.id]) : null;
  return String(school.espnId);
}
