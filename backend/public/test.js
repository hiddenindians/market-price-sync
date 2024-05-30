const fetchProducts = async () => {
  let enabledSets
  let externalIds
  let prices
  let products
  let priceArray
  let productArray
  await getEnabledSets().then(async (data) => {
    if (data.total != 0) {
      enabledSets = data.data
    }
  })

  for (var i = 0; i < enabledSets.length; i++) {
    await getExternalIdForGame(sets[i].game_id).then(async (gameId) => {
      externalIds.push(gameId)
    })
  }

  for (var i = 0; i < externalIds.length; i++) {
    await axios
      .get(`https://tcgcsv.com/${gameId}/${set.external_id.tcgcsv_id}/products`)
      //create products
      .then(async (data) => {
        products = data.data.results
      })

    await axios
      .get(`https://tcgcsv.com/${externalIds[i]}/${enabledSets[i].external_id.tcgcsv_id}/prices`)
      .then((data) => {
        if (data.data.totalItems != 0) {
          prices = data.data.results
        }
      })

    if (prices.length != 0 && products.length != 0) {
      for (var i = 0; i < prices.length; i++) {
        for (var j = 0; j < products.length; j++) {
          if (prices[i].productId === products[j].productId) {
            let product = {}
            let price = {}
            if (products[j].extendedData) {
              for (var k = 0; k < products[j].extendedData.length; k++) {
                switch (products[j].extendedData[k].name) {
                  case 'UPC':
                    product.upc = products[j].extendedData[k].value
                    break
                  //Universal
                  case 'CardText':
                    product.text = products[j].extendedData[k].value
                    break
                  case 'Number':
                    product.collector_number = products[j].extendedData[k].value
                    break
                  case 'Rarity':
                    product.rarity = products[j].extendedData[k].value
                    break
                  //MTG
                  case 'SubType':
                    product.sub_type = products[j].extendedData[k].value
                    break
                  case 'P':
                    product.power = products[j].extendedData[k].value
                    break
                  case 'T':
                    product.toughness = products[j].extendedData[k].value
                    break
                  case 'OracleText':
                    product.text = products[j].extendedData[k].value
                    break
                  case 'FlavorText':
                    product.flavor_text = products[j].extendedData[k].value
                    break
                  //Pokemon
                  case 'Card Type':
                    product.card_type = products[j].extendedData[k].value
                    break
                  case 'HP':
                    product.hp = products[j].extendedData[k].value
                    break
                  case 'Stage':
                    product.stage = products[j].extendedData[k].value
                    break
                  case 'Attack 1':
                    product.attack_1 = products[j].extendedData[k].value
                    break
                  case 'Attack 2':
                    product.attack_2 = products[j].extendedData[k].value
                    break
                  case 'Attack 3':
                    product.attack_3 = products[j].extendedData[k].value
                    break
                  case 'Attack 4':
                    product.attack_4 = products[j].extendedData[k].value
                    break
                  case 'Weakness':
                    product.weakness = products[j].extendedData[k].value
                    break
                  case 'Resistance':
                    product.resistance = products[j].extendedData[k].value
                    break
                  case 'Retreat Cost':
                    product.retreat_cost = products[j].extendedData[k].value
                    break
                  //One Piece / DBS FW
                  case 'Description':
                    product.text = products[j].extendedData[k].value
                    break
                  case 'Color':
                    product.colour = products[j].extendedData[k].value
                    break
                  case 'Cost':
                    product.cost = products[j].extendedData[k].value
                    break
                  case 'CardType':
                    product.card_type = products[j].extendedData[k].value
                    break
                  case 'Life': //one piece only
                    product.life = products[j].extendedData[k].value
                    break
                  case 'Counterplus': //one piece only
                    product.counter = products[j].extendedData[k].value
                    break
                  case 'Power':
                    product.power = products[j].extendedData[k].value
                    break
                  case 'SubTypes':
                    product.sub_type = products[j].extendedData[k].value
                    break
                  case 'Attribute':
                    product.attribute = products[j].extendedData[k].value
                    break
                  case 'Combo Power': //DBS Only
                    product.combo_power = products[j].extendedData[k].value
                    break
                  case 'Character Traits': //DBS only
                    product.sub_type = products[j].extendedData[k].value
                    break
                  // Lorcana
                  case 'Property':
                    product.property = products[j].extendedData[k].value
                    break
                  case 'Cost Ink':
                    product.cost = products[j].extendedData[k].value
                    break
                  case 'Character Version':
                    product.character_version = products[j].extendedData[k].value
                    break
                  case 'InkType':
                    product.ink_type = products[j].extendedData[k].value
                    break
                  case 'Strength':
                    product.power = products[j].extendedData[k].value
                    break
                  case 'Willpower':
                    product.toughness = products[j].extendedData[k].value
                    break
                  case 'Lore Value':
                    product.lore_value = products[j].extendedData[k].value
                    break
                  case 'Flavor Text':
                    product.flavor_text = products[j].extendedData[k].value
                    break
                }
              }
            } else {
              console.log(products[j])
            }
            product.set_id = set._id
            product.game_id = set.game_id
            product.external_id = {}
            product.external_id.tcgcsv_id = products[j].productId
            product.name = `${products[j].name}`
            product.image_url = `${products[j].imageUrl.slice(0, -8)}400w.jpg`
            product.buying = {
              enabled: false,
              quantity: 0
            }
            product.selling = {
              enabled: false,
              quantity: 0
            }

            if (products[j].extendedData.length <= 2) {
              if (products[j].extendedData.name && products[j].extendedData.name.includes('Token')) {
                product.type = 'Single Cards'
              } else if (products[j].name.includes('Code Card')) {
                product.type = 'Single Cards'
              } else if (products[j].name.includes('Booster')) {
                product.type = 'Boosters'
              } else if (products[j].name.includes('Deck')) {
                product.type = 'Decks'
              } else if (products[j].name.includes('Elite Trainer Box')) {
                product.type = 'Elite Trainer Boxes'
              } else if (products[j].name.includes('Double Pack')) {
                product.type = 'Boosters'
              } else if (products[j].name.includes('Build & Battle Box')) {
                product.type = 'Build & Battle Boxes'
              } else if (products[j].name.includes('Blister')) {
                product.type = 'Boosters'
              } else {
                product.type = 'sealed'
              }
            } else {
              product.type = 'Single Cards'
            }

            if (product.type === 'Single Cards' && !product.name.includes('Code Card')) {
              if (products[j].name.includes(product.collector_number)) {
                product.name += ` (${prices[i].subTypeName}, ${product.rarity})`
              } else {
                product.name += ` - ${product.collector_number} (${prices[i].subTypeName}, ${product.rarity})`
              }
            }

            if (prices[i].productId === products[j].productId) {
              if (prices[i].marketPrice) {
                price.market_price = {
                  [prices[i].subTypeName]: Number(prices[i].marketPrice)
                }
              } else {
                price.market_price = {
                  [prices[i].subTypeName]: Number(prices[i].midPrice)
                }
              }

              product.last_updated = Date.now()
            }
            productArray.push(product);
            priceArray.push(price);
          }
        }
      }
    }
  }

  console.log(externalIds)
  console.log(enabledSets)
  console.log(prices)
  console.log(products)
}
