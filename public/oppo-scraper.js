const axios = require('axios');
const { setTimeout } = require('timers/promises'); // Untuk delay menggunakan await

// Data perangkat yang relevan dari fileoppo.txt
const model_list_data = [
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0574",
      "externalMarketingSeriesName": "Find N Series",
      "marketingModelName": "OPPO Find N5",
      "marketingModelCode": "08c024665d024cf9a66b3cf72497abea",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "59",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2671",
        "PKH110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2671.png",
      "queryCategoryCodeMap": {
        "PKH110": "01",
        "CPH2671": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A5 Pro 5G",
      "marketingModelCode": "1e7e8f2bbd854696b002114a6af9f2b3",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "58",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PKP110",
        "CPH2695"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2695.png",
      "queryCategoryCodeMap": {
        "PKP110": "01",
        "CPH2695": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A5 Pro",
      "marketingModelCode": "ed5fca9fd0834472a45b291e066904be",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "57",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2711"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2711.png",
      "queryCategoryCodeMap": {
        "CPH2711": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno13 F",
      "marketingModelCode": "55e847e585e24bbc83ca91ec8cad72b3",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "56",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2701"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2701.png",
      "queryCategoryCodeMap": {
        "CPH2701": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno13 F 5G",
      "marketingModelCode": "a03675360a3343f496d42fb8cf6856be",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "55",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2699"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2699.png",
      "queryCategoryCodeMap": {
        "CPH2699": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno13 5G",
      "marketingModelCode": "9958af5abefd4250a159a65cef1d41db",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "54",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2689"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2689.png",
      "queryCategoryCodeMap": {
        "CPH2689": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0573",
      "externalMarketingSeriesName": "Find X Series",
      "marketingModelName": "OPPO Find X8",
      "marketingModelCode": "83807488cba44c4687ea4a5011b67bd4",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "53",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2651",
        "PKB110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2651.png",
      "queryCategoryCodeMap": {
        "CPH2651": "01",
        "PKB110": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0573",
      "externalMarketingSeriesName": "Find X Series",
      "marketingModelName": "OPPO Find X8 Pro",
      "marketingModelCode": "f21a4e0e577d44deb5e19180f05d5efc",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "52",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2659",
        "PKC110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2659.png",
      "queryCategoryCodeMap": {
        "CPH2659": "01",
        "PKC110": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A3",
      "marketingModelCode": "b7c9e56aa4324d1c87f815e31626b0f1",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "51",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PADM00",
        "PADT00",
        "CPH1837",
        "CPH2669"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2669.png",
      "queryCategoryCodeMap": {
        "CPH2669": "01",
        "CPH1837": "01",
        "PADT00": "01",
        "PADM00": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A3x",
      "marketingModelCode": "27e565008ce14022a74476140d063b92",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "50",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2641"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2641.png",
      "queryCategoryCodeMap": {
        "CPH2641": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A3 Pro 5G",
      "marketingModelCode": "f9592080b2c2443bafaa023e019e2cb7",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "49",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PJY110",
        "CPH2639",
        "CPH2665"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2639.png",
      "queryCategoryCodeMap": {
        "CPH2639": "01",
        "CPH2665": "01",
        "PJY110": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A60",
      "marketingModelCode": "427132b413864a598e27173fb1b2f630",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "48",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2631",
        "CPH3669"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2631.png",
      "queryCategoryCodeMap": {
        "CPH3669": "01",
        "CPH2631": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A98 5G",
      "marketingModelCode": "7e183a3171034f52a8a4651c97d6a15c",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "47",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2529"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2529.png",
      "queryCategoryCodeMap": {
        "CPH2529": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A96",
      "marketingModelCode": "b915c0047dd54541b9f3dd3cd23fd977",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "46",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2333",
        "PESM10"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2333.png",
      "queryCategoryCodeMap": {
        "PESM10": "01",
        "CPH2333": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A95",
      "marketingModelCode": "d93e64f5f5634cd098cf98117cd0e1bf",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "45",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2365"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2365": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A79 5G",
      "marketingModelCode": "110b751d57584c5ab490d9632245436a",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "44",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "A303OP",
        "CPH2553",
        "CPH2557"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2557.png",
      "queryCategoryCodeMap": {
        "CPH2557": "01",
        "A303OP": "01",
        "CPH2553": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A78 5G",
      "marketingModelCode": "d1892777fc8d46fc8d12dfa21af26809",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "43",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2483",
        "CPH2495"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2483.png",
      "queryCategoryCodeMap": {
        "CPH2495": "01",
        "CPH2483": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A78",
      "marketingModelCode": "bb70939bb9e5454783a125ce400209c0",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "42",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2565"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2565.png",
      "queryCategoryCodeMap": {
        "CPH2565": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A77s",
      "marketingModelCode": "4f43ea7d0b8140e085f55308e92ef3bf",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "41",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2473"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2473.png",
      "queryCategoryCodeMap": {
        "CPH2473": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A76",
      "marketingModelCode": "6152a12053e042a6bde6bc08903a1d2d",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "40",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2375"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2375": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A58",
      "marketingModelCode": "77aa3c05662d4d50826338ee514461bd",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "39",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2577"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2577.png",
      "queryCategoryCodeMap": {
        "CPH2577": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A57",
      "marketingModelCode": "f89d2c6ecc3a4ae6b9a84639b8616b42",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "38",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2357",
        "CPH2387",
        "CPH2407",
        "A57",
        "A57t",
        "CPH1701"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH1701.png",
      "queryCategoryCodeMap": {
        "CPH1701": "01",
        "A57": "01",
        "CPH2407": "01",
        "CPH2387": "01",
        "CPH2357": "01",
        "A57t": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A55",
      "marketingModelCode": "d6ac8c913a89452f872690fecb1feb30",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "37",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2325"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2325": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A54",
      "marketingModelCode": "fa2d6a3fe6144a4a816345293c9f195e",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "36",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2239",
        "CPH2241"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2239": "01",
        "CPH2241": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A38",
      "marketingModelCode": "fb8734df988541b099d04dd3ed7c46b8",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "35",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2579",
        "CPH2591"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2579.png",
      "queryCategoryCodeMap": {
        "CPH2579": "01",
        "CPH2591": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno12 F",
      "marketingModelCode": "c9f11696795f44e6806e09194fda3de5",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "34",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2687"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2687.png",
      "queryCategoryCodeMap": {
        "CPH2687": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A18",
      "marketingModelCode": "ac29623742ae49a3a3de7ddc53a30034",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "34",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2591"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2591.png",
      "queryCategoryCodeMap": {
        "CPH2591": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno12 F 5G",
      "marketingModelCode": "5c59165e46df4c33bb952369698c3368",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "33",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2637"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2637.png",
      "queryCategoryCodeMap": {
        "CPH2637": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A17k",
      "marketingModelCode": "eb47fd6ea18d4c0aa0cb22644feadb08",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "33",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2471"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2471.png",
      "queryCategoryCodeMap": {
        "CPH2471": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno12 Pro 5G",
      "marketingModelCode": "bdb755df172f465e9a2bf5cacf08b080",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "32",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2629"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2629.png",
      "queryCategoryCodeMap": {
        "CPH2629": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A17",
      "marketingModelCode": "933068751bb94dd9947be9fdf45db8c4",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "32",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2477",
        "CPH2485"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2477.png",
      "queryCategoryCodeMap": {
        "CPH2485": "01",
        "CPH2477": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno12 5G",
      "marketingModelCode": "c04dc10265d046b483d33a781acee713",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "31",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2625"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2625.png",
      "queryCategoryCodeMap": {
        "CPH2625": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A16k",
      "marketingModelCode": "6630d79c876a4af1b00d308fcaafcd01",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "31",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2349",
        "CPH2351"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2349": "01",
        "CPH2351": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno11 Pro 5G",
      "marketingModelCode": "168d02bbf17a450898068833cf476468",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "30",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2607",
        "PJJ110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2607.png",
      "queryCategoryCodeMap": {
        "CPH2607": "01",
        "PJJ110": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A16e",
      "marketingModelCode": "feaa379194894eecbce6d35831623765",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "30",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2421"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2421": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno11 F 5G",
      "marketingModelCode": "efbf37d2b0a944d5918394fda34ccfe1",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "29",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2603"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2603.png",
      "queryCategoryCodeMap": {
        "CPH2603": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A16",
      "marketingModelCode": "4e0bb42d6059432eba99b670b8dda791",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "29",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2269",
        "CPH2275"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2275": "01",
        "CPH2269": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno11 5G",
      "marketingModelCode": "99d4b7574fde465c808429df5ff5d370",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "28",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2599",
        "PJH110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2599.png",
      "queryCategoryCodeMap": {
        "PJH110": "01",
        "CPH2599": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A11K",
      "marketingModelCode": "fd81003389bd4776b8e5ba5f5e5b38c5",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "28",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2071",
        "CPH2083"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2071": "01",
        "CPH2083": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno10 Pro+ 5G",
      "marketingModelCode": "fcb8a30569ed44ef87d72b9ce4c8c64e",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "27",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2521",
        "PHU110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2521.png",
      "queryCategoryCodeMap": {
        "PHU110": "01",
        "CPH2521": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno10 Pro 5G",
      "marketingModelCode": "298ffdfa5a8e455fb11ef68fdc6163e7",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "26",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "A302OP",
        "CPH2525",
        "CPH2541",
        "PHV110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PHV110": "01",
        "CPH2525": "01",
        "A302OP": "01",
        "CPH2541": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A12",
      "marketingModelCode": "577db09cc13149d594d0e4c01a77351f",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "26",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2083",
        "CPH2077"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2083": "01",
        "CPH2077": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno10 5G",
      "marketingModelCode": "d74d84aa621a479189724e06763fc6db",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "25",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2531",
        "PHW110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2531.png",
      "queryCategoryCodeMap": {
        "PHW110": "01",
        "CPH2531": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A15",
      "marketingModelCode": "d13b995ae964477ba729a6f1ca8b31d4",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "25",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2185",
        "CPH2185IN"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2185": "01",
        "CPH2185IN": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno8 Z 5G",
      "marketingModelCode": "3be786dda3af45fc871639c2a3b58494",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "24",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2455",
        "CPH2457",
        "CPH2343"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2455.png",
      "queryCategoryCodeMap": {
        "CPH2343": "01",
        "CPH2457": "01",
        "CPH2455": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A15s",
      "marketingModelCode": "70ce3892bbb341ff815cea40ece41276",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "24",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2179"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2179": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno8 T 5G",
      "marketingModelCode": "274bbf51875d480c8d5e458cd8bd48ac",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "23",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2505",
        "CPH2507",
        "CPH2517"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2505.png",
      "queryCategoryCodeMap": {
        "CPH2505": "01",
        "CPH2507": "01",
        "CPH2517": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A1K",
      "marketingModelCode": "b28b7d74f76149a59c3f273b2dcc9943",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "23",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH1923"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH1923": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno8 T",
      "marketingModelCode": "ac83c900b6764b7bb10f423472b3a1c7",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "22",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2481"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2481.png",
      "queryCategoryCodeMap": {
        "CPH2481": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A31",
      "marketingModelCode": "4138ffa70c424f9a89c1969abe1c019b",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "22",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2015",
        "/历史数据",
        "16G",
        "A31",
        "CPH2031",
        "CPH2073",
        "CPH2081"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2081": "01",
        "16G": "01",
        "CPH2031": "01",
        "CPH2073": "01",
        "/历史数据": "01",
        "CPH2015": "01",
        "A31": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno8 Pro 5G",
      "marketingModelCode": "a1b4fcd63b0b4154893b145b2a4f12e8",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "21",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2357",
        "PGAM10"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PGAM10": "01",
        "CPH2357": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A33",
      "marketingModelCode": "9cb13e5efd2d454792c8db3100f65882",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "21",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2137",
        "A33",
        "CPH2127"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "A33": "01",
        "CPH2127": "01",
        "CPH2137": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno8 5G",
      "marketingModelCode": "44d33db50454437aaafd8f563604c648",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "20",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2359",
        "PGBM10"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2359": "01",
        "PGBM10": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno8",
      "marketingModelCode": "8ab633fb3e074624907b0a05a4eeef54",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "19",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2461"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2461.png",
      "queryCategoryCodeMap": {
        "CPH2461": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "02",
      "categoryName": "Wearables",
      "externalMarketingSeriesCode": "ES0674",
      "externalMarketingSeriesName": "Watch X",
      "marketingModelName": "OPPO Watch X",
      "marketingModelCode": "9eec9329b40944deaed40bd0feff00fd",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "19",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "OWW231",
        "OWWE231"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/02/OWW231.png",
      "queryCategoryCodeMap": {
        "OWW231": "02",
        "OWWE231": "02"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno7 Z",
      "marketingModelCode": "a691d745292c412891373ed06884bc57",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "18",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2343"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2343.png",
      "queryCategoryCodeMap": {
        "CPH2343": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A39",
      "marketingModelCode": "f394378b4f324749a36282949154a438",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "18",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH1605"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH1605": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno7 5G",
      "marketingModelCode": "bcff35d1d4244b71be328380e1348b40",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "17",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2371",
        "PFJM10"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2371": "01",
        "PFJM10": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "08",
      "categoryName": "Tablet",
      "externalMarketingSeriesCode": "ES0648",
      "externalMarketingSeriesName": "Pad",
      "marketingModelName": "OPPO Pad 2",
      "marketingModelCode": "3927b8ae45c14e229287dbbedb43e64a",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "17",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "OPD2201",
        "OPD2202"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/08/OPD2202.png",
      "queryCategoryCodeMap": {
        "OPD2202": "08",
        "OPD2201": "08"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A3s",
      "marketingModelCode": "0d6eb4e2394147f382f9423396067011",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "17",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH1803",
        "CPH1805",
        "CPH1853"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH1853": "01",
        "CPH1805": "01",
        "CPH1803": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno7",
      "marketingModelCode": "371fda754a53440b9910680d09836be0",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "16",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2363"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2363.png",
      "queryCategoryCodeMap": {
        "CPH2363": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "08",
      "categoryName": "Tablet",
      "externalMarketingSeriesCode": "ES0677",
      "externalMarketingSeriesName": "Pad Air",
      "marketingModelName": "OPPO Pad Air",
      "marketingModelCode": "22ee744509744bafac226c992993ade1",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "16",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "OPD2102A",
        "OPD2102"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/08/OPD2102A.png",
      "queryCategoryCodeMap": {
        "OPD2102": "08",
        "OPD2102A": "08"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A5 2020",
      "marketingModelCode": "6f0edeb879bd4a40a1536a48167c40a3",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "16",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH1931",
        "CPH1933",
        "CPH1943"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH1943": "01",
        "CPH1933": "01",
        "CPH1931": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "03",
      "categoryName": "Audio",
      "externalMarketingSeriesCode": "ES0205",
      "externalMarketingSeriesName": "Air Series",
      "marketingModelName": "OPPO Enco Air3 True Wireless Earbuds",
      "marketingModelCode": "d8cdb694ccec4ee79bbf497bb52c5d21",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "15",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "ETE31&ETE32"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "ETE31&ETE32": "03"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno6 Pro 5G",
      "marketingModelCode": "57bb5986a7934f86b7d3cf7a0d27fa75",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "15",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2249",
        "PEPM00",
        "CPH2247"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2249": "01",
        "PEPM00": "01",
        "CPH2247": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "02",
      "categoryName": "Wearables",
      "externalMarketingSeriesCode": "ES0671",
      "externalMarketingSeriesName": "Band",
      "marketingModelName": "OPPO Band2",
      "marketingModelCode": "f285078f31d24ead86e5d9101e92a326",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "14",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "OBBE215"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/02/OBBE215.png",
      "queryCategoryCodeMap": {
        "OBBE215": "02"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A52",
      "marketingModelCode": "c17396e08a3d4153acee9fa7f54dd246",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "14",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PDAM10",
        "PDAT10",
        "CPH2061",
        "CPH2069"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PDAT10": "01",
        "CPH2061": "01",
        "CPH2069": "01",
        "PDAM10": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno6 5G",
      "marketingModelCode": "20cca39b6b8441078d35fa5edbf99eb0",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "14",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PEQM00",
        "CPH2251"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2251": "01",
        "PEQM00": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "03",
      "categoryName": "Audio",
      "externalMarketingSeriesCode": "ES0205",
      "externalMarketingSeriesName": "Air Series",
      "marketingModelName": "OPPO Enco Air2 Pro True Wireless Noise Cancelling Earbuds",
      "marketingModelCode": "53f4cd49e8a24416859bf799765dc62e",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "13",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "ETE21&ETE22",
        "ETE21&ETE2"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "ETE21&ETE22": "03",
        "ETE21&ETE2": "03"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A53",
      "marketingModelCode": "276713815bb74514adcc102177b66c67",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "13",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2139",
        "A53",
        "CPH2127",
        "CPH2131",
        "CPH2133",
        "CPH2137"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2139": "01",
        "CPH2133": "01",
        "CPH2131": "01",
        "CPH2127": "01",
        "CPH2137": "01",
        "A53": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno6",
      "marketingModelCode": "cfe0290ceaca459ca0e2093d252a595e",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "13",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2235"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2235": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "03",
      "categoryName": "Audio",
      "externalMarketingSeriesCode": "ES0583",
      "externalMarketingSeriesName": "Buds Series",
      "marketingModelName": "OPPO Enco Buds2",
      "marketingModelCode": "03909026088c4727a247ebd1564857c7",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "12",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "ETE41&ETE42"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "ETE41&ETE42": "03"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A53 5G",
      "marketingModelCode": "3604aa10ed8d430da29aab84edb20360",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "12",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2127",
        "CPH2139",
        "PECM20",
        "PECM30",
        "PECT30"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PECM20": "01",
        "PECM30": "01",
        "CPH2139": "01",
        "PECT30": "01",
        "CPH2127": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno5 F",
      "marketingModelCode": "c0acd223c081439c957310bd8013fb73",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "12",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2217"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2217.png",
      "queryCategoryCodeMap": {
        "CPH2217": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "02",
      "categoryName": "Wearables",
      "externalMarketingSeriesCode": "ES0647",
      "externalMarketingSeriesName": "Watch Free",
      "marketingModelName": "OPPO Watch Free",
      "marketingModelCode": "0a724ac6e2f144b4a404a8f14746811b",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "11",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "OWWE201",
        "OWW206"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/02/OWWE201.png",
      "queryCategoryCodeMap": {
        "OWWE201": "02",
        "OWW206": "02"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A5s",
      "marketingModelCode": "b80ce22d8c44486ea31a21260c44e12f",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "11",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH1909",
        "CPH1912",
        "CPH1920"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH1920": "01",
        "CPH1912": "01",
        "CPH1909": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno5 5G",
      "marketingModelCode": "6832371129914b75ab28c2dd3ab482f9",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "11",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2145",
        "PEGM00",
        "PEGT00"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PEGT00": "01",
        "CPH2145": "01",
        "PEGM00": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "03",
      "categoryName": "Audio",
      "externalMarketingSeriesCode": "ES0205",
      "externalMarketingSeriesName": "Air Series",
      "marketingModelName": "OPPO Enco Air True Wireless Earbuds",
      "marketingModelCode": "62946e87ccdb4686a60b691d28079f76",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "10",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "",
        "ETI61&ETI62"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "": "03",
        "ETI61&ETI62": "03"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno5",
      "marketingModelCode": "c59e9e761167487ba19b5575a2bc943a",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "10",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2159"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2159": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A7",
      "marketingModelCode": "ab8c9400f30a4fafacb199b28cc6490d",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "10",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PBFM00",
        "PBFT00",
        "CPH1901",
        "CPH1903",
        "CPH1905"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH1903": "01",
        "CPH1901": "01",
        "PBFT00": "01",
        "CPH1905": "01",
        "PBFM00": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "03",
      "categoryName": "Audio",
      "externalMarketingSeriesCode": "ES0583",
      "externalMarketingSeriesName": "Buds Series",
      "marketingModelName": "OPPO Enco Buds",
      "marketingModelCode": "3458d83bceb64c73a1a77fca89345d2d",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "9",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "ETI81&ETI82"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "ETI81&ETI82": "03"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno4 Pro",
      "marketingModelCode": "bde62aa0eaed42ca8e199c895b4a51e1",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "9",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2109"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2109": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A71",
      "marketingModelCode": "1d45f73676fb4a94bb4dfc968e02fddb",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "9",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH1717"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH1717": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "02",
      "categoryName": "Wearables",
      "externalMarketingSeriesCode": "ES0671",
      "externalMarketingSeriesName": "Band",
      "marketingModelName": "OPPO Band",
      "marketingModelCode": "578e8d634c6940aba942fee68e4635cc",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "8",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "OB19B1",
        "X19B2"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/02/OB19B1.png",
      "queryCategoryCodeMap": {
        "OB19B1": "02",
        "X19B2": "02"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno4 F",
      "marketingModelCode": "986f74c02cdc4c6db9f1c7fc727a0a0a",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "8",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2121",
        "CPH2209"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2209": "01",
        "CPH2121": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno4",
      "marketingModelCode": "230973433dba4d4a8ad79cabeeaed694",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "7",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2113"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2113": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A74",
      "marketingModelCode": "9d49a28badee48b38d14e1301bef3b6b",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "7",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2219"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2219": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno3 Pro",
      "marketingModelCode": "bf6b1a92b27d4504a2fcdd0f31342128",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "6",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PCRM00",
        "PCRT00",
        "CPH2009",
        "CPH2035",
        "CPH2036",
        "CPH2037"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2009": "01",
        "PCRM00": "01",
        "CPH2035": "01",
        "CPH2037": "01",
        "CPH2036": "01",
        "PCRT00": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A74 5G",
      "marketingModelCode": "a98485b7a2034a0e835b24362d8f14ca",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "6",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2197",
        "CPH2263"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2263": "01",
        "CPH2197": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "03",
      "categoryName": "Audio",
      "externalMarketingSeriesCode": "ES0206",
      "externalMarketingSeriesName": "X Series",
      "marketingModelName": "OPPO Enco X True Wireless Noise Canceling Earphones",
      "marketingModelCode": "5d42db31d8324cdea6d507b1be754100",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "5",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "ETI51&ETI52"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "ETI51&ETI52": "03"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0573",
      "externalMarketingSeriesName": "Find X Series",
      "marketingModelName": "OPPO Find X5 Pro",
      "marketingModelCode": "6f0a8a502f7242ed8a1b971f4558d701",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "5",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2305",
        "PFEM10"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2305": "01",
        "PFEM10": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno3",
      "marketingModelCode": "4bb7dfeedf0749b586ba53b882a65996",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "5",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2043",
        "PCLM50",
        "PDCM00",
        "A001OP",
        "PDCT00"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PDCT00": "01",
        "A001OP": "01",
        "PCLM50": "01",
        "CPH2043": "01",
        "PDCM00": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A83",
      "marketingModelCode": "1c2665ce61cc4ca3bb8b2d4fb6204341",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "5",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "A1 A83",
        "A83",
        "CPH1715",
        "CPH1729",
        "CPH1827"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "A1 A83": "01",
        "CPH1827": "01",
        "CPH1715": "01",
        "CPH1729": "01",
        "A83": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0573",
      "externalMarketingSeriesName": "Find X Series",
      "marketingModelName": "OPPO Find X3 Pro",
      "marketingModelCode": "f4f0abd1b085499ef9f51d9e2e28d271d",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "4",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PEEM00",
        "CPH2173",
        "OPG02",
        "OPG03"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2173": "01",
        "OPG02": "01",
        "OPG03": "01",
        "PEEM00": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno2 F",
      "marketingModelCode": "a5be5cb9cc584e4c8ed1d7d668db022c",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "4",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH1989"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH1989": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A9 2020",
      "marketingModelCode": "805e3ebb297d4fbead7ae3ae1b7bc906",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "4",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH1937",
        "CPH1941"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH1941": "01",
        "CPH1937": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0573",
      "externalMarketingSeriesName": "Find X Series",
      "marketingModelName": "OPPO Find X2 Pro",
      "marketingModelCode": "65e943b97c4a4c1ba97eb0a3bff1d2fc",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "3",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PDEM30",
        "CPH2025"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PDEM30": "01",
        "CPH2025": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0410",
      "externalMarketingSeriesName": "Reno Series",
      "marketingModelName": "OPPO Reno2",
      "marketingModelCode": "94dc5f99f8ea4a26b6c2583d979f7e6b",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "3",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PCKM00",
        "CPH1907"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PCKM00": "01",
        "CPH1907": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0574",
      "externalMarketingSeriesName": "Find N Series",
      "marketingModelName": "OPPO Find N3",
      "marketingModelCode": "bef56259de7745cf902a1d4a4db70782",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "3",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2499",
        "PHN110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2499.png",
      "queryCategoryCodeMap": {
        "PHN110": "01",
        "CPH2499": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A91",
      "marketingModelCode": "c121e058021c45fb89144d702dfd3611",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "3",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PCPM00",
        "CPH2001",
        "CPH2021",
        "PCPT00"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2001": "01",
        "PCPM00": "01",
        "CPH2021": "01",
        "PCPT00": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0573",
      "externalMarketingSeriesName": "Find X Series",
      "marketingModelName": "OPPO Find X2",
      "marketingModelCode": "9ebb01e788fe472a81656adfd12eb870",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "2",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PDEM10",
        "PDET10",
        "CPH2023"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PDET10": "01",
        "CPH2023": "01",
        "PDEM10": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0574",
      "externalMarketingSeriesName": "Find N Series",
      "marketingModelName": "OPPO Find N3 Flip",
      "marketingModelCode": "a3e523e5c7304e67980f6bf449f70a24",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "2",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2519",
        "PHT110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2519.png",
      "queryCategoryCodeMap": {
        "PHT110": "01",
        "CPH2519": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0376",
      "externalMarketingSeriesName": "A Series",
      "marketingModelName": "OPPO A92",
      "marketingModelCode": "0de4ac97b1df4219bfdf33dd5b40a49b",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "2",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2059"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "CPH2059": "01"
      },
      "isHighEndModel": false
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0573",
      "externalMarketingSeriesName": "Find X Series",
      "marketingModelName": "OPPO Find X",
      "marketingModelCode": "9004b230f2b746afb543bbfcfe36579d",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "1",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "PAFM00",
        "PAFT00",
        "PAHM00",
        "CPH1871",
        "CPH1875"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/default/unknown.png",
      "queryCategoryCodeMap": {
        "PAFM00": "01",
        "CPH1875": "01",
        "PAFT00": "01",
        "CPH1871": "01",
        "PAHM00": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    },
    {
      "brandName": "OPPO",
      "brandCode": "11",
      "categoryCode": "01",
      "categoryName": "Mobile phone",
      "externalMarketingSeriesCode": "ES0574",
      "externalMarketingSeriesName": "Find N Series",
      "marketingModelName": "OPPO Find N2 Flip",
      "marketingModelCode": "cda00122f6c24cecb67efc5a2817d348",
      "isDisplayServiceOfficeSite": "true",
      "productMarketingModelOrderNo": "1",
      "regionIsoCode2": "ID",
      "certifiedModels": [
        "CPH2437",
        "PGT110"
      ],
      "imgUrl": "https://image.oppo.com/content/dam/oppo/common/support/self-service/products/id/01/CPH2437.png",
      "queryCategoryCodeMap": {
        "PGT110": "01",
        "CPH2437": "01"
      },
      "isHighEndModel": true // Diambil dari JSON asli
    }
];


const GET_PRICE_URL = 'https://sgp-sow-cms.oppo.com/oppo-api/basic/v1/getPartPriceNew';

const BASE_HEADERS = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Origin': 'https://support.oppo.com',
    'Referer': 'https://support.oppo.com/',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cookie': 'cookiesaccepted=true',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.118 Safari/537.36'
};

const BASE_PAYLOAD = {
  "region": "id",
  "regionIsoCode2": "id",
  "isoLanguageCode": "id",
  "sourceRoute": "1"
};

async function processModels() {
    console.log(`Memproses ${model_list_data.length} model...`);

    for (let i = 0; i < model_list_data.length; i++) {
        const model_info = model_list_data[i];
        const model_code = model_info.marketingModelCode;
        const model_name = model_info.marketingModelName || "Nama Model Tidak Diketahui";

        console.log(`\n--- START DATA UNTUK MODEL: ${model_name} (${model_code}) [${i+1}/${model_list_data.length}] ---`);

        if (!model_code) {
            console.log(`  SKIP: Tidak ada marketingModelCode untuk model: ${model_name}`);
            console.log(`--- END DATA UNTUK MODEL: ${model_name} (${model_code}) ---`);
            continue;
        }

        const current_payload = { ...BASE_PAYLOAD, marketingModelCode: model_code };

        const current_headers = { ...BASE_HEADERS, 'Page-Path': `https://support.oppo.com/id/spare-parts-price/#/detail?marketingModelCode=${model_code}` };

        try {
            // Timeout in milliseconds (15000ms = 15 seconds)
            const response = await axios.post(GET_PRICE_URL, current_payload, {
                headers: current_headers,
                timeout: 15000 // in milliseconds
            });

            // axios automatically throws an error for non-2xx status codes
            // and automatically parses JSON response data into response.data

            if (response.data && response.data.code === "1" && response.data.msg === "ok") {
                console.log(JSON.stringify(response.data, null, 2)); // Pretty print JSON
            } else {
                console.log(`  ERROR: Gagal mendapatkan data detail. Respon API:`);
                console.log(JSON.stringify(response.data, null, 2)); // Pretty print error response
            }

        } catch (error) {
            if (error.response) {
                // Request made and server responded with a status code that falls out of the range of 2xx
                console.error(`  ERROR HTTP: ${error.response.status} ${error.response.statusText}`);
                if (error.response.data) {
                   console.error(`  Response data: ${JSON.stringify(error.response.data, null, 2)}`);
                } else {
                   console.error(`  Response text: ${error.response.text}`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                if (error.code === 'ECONNABORTED') {
                    console.error(`  ERROR: Timeout saat mengambil data.`);
                } else {
                    console.error(`  ERROR Permintaan: Tidak ada respon dari server.`, error.message);
                }
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error(`  ERROR Tidak Terduga:`, error.message);
            }
        }

        console.log(`--- END DATA UNTUK MODEL: ${model_name} (${model_code}) ---`);

        // Delay 1 detik (1000 ms) sebelum permintaan berikutnya
        await setTimeout(1000);
    }

    console.log("\n--- PROSES SELESAI ---");
}

// Jalankan fungsi utama
processModels();