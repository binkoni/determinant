var app = {}

app.tbodyToMatrix = function(tbody) {
  var matrix = []
  for(var i = 0; i < tbody.children.length; ++i)
    matrix[i] = []
  for(var i = 0; i < tbody.children.length; ++i) {
    for(var j = 0; j < tbody.children.length; ++j) {
      matrix[i][j] = tbody.children[i].children[j].children[0].value
    }
  }
  return matrix
}

app.matrixToTbody = function(matrix) {
  var tbody = document.createElement('tbody')
  for(var i = 0; i < matrix.length; ++i) {
    tbody.appendChild(document.createElement('tr'))
    for(var j = 0; j < matrix.length; ++j) {
      tbody.children[i].appendChild(document.createElement('td'))
      var input = document.createElement('input')
      input.type = 'text'
      input.value = matrix[i][j]
      tbody.children[i].children[j].appendChild(input)
    }
  }
  return tbody
}

app.generateMatrix = function(size, min, max) {
  var matrix = []
  for(var i = 0; i < size; ++i)
    matrix[i] = []
  for(var i = 0; i < size; ++i) {
    for(var j = 0; j < size; ++j) {
      matrix[i][j] = Math.floor(Math.random() * (max + 1 - min) + min)
    }
  }
  return matrix
}

app.getMinor = function(matrix, row, column) {
  var minor = []
  var iCount = 0
  var jCount = 0
  for(var i = 0; i < matrix.length - 1; ++i)
    minor[i] = []
  for(var i = 0; i < matrix.length; ++i) {
    for(var j = 0; j < matrix.length; ++j) {
      if(i + 1 != row && j + 1 != column) {
        minor[iCount][jCount] = matrix[i][j]
        ++jCount
        if(jCount == minor.length) {
          jCount = 0
          ++iCount
          if(iCount == minor.length)
            break
        }
      }
    }
  }
  return minor
}

app.getCofactor = function(matrix, row, column) {
  return Math.pow(-1, row + column) * app.getDeterminant(app.getMinor(matrix, row, column))
}

app.getDeterminant = function(matrix) {
  var determinant = 0
  if(matrix.length == 2)
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  for(var j = 0; j < matrix.length; ++j)
    determinant += matrix[0][j] * app.getCofactor(matrix, 1, j + 1)
  return determinant
}

document.addEventListener('click', function(event) {
  if(event.target.id == 'generate') {
    var matrixSize = document.getElementById('matrixSize').value || 3
    var minValue = Number(document.getElementById('minValue').value) || 0
    var maxValue = Number(document.getElementById('maxValue').value) || minValue + 9
    var matrix = app.generateMatrix(matrixSize, minValue, maxValue)
    var determinant = app.getDeterminant(matrix)
/*    while(determinant >= 100 || determinant <= -100) {
      app.generateMatrix(matrixSize, minValue, maxValue)
      determinant = app.getDeterminant(matrix)
    }
*/
    var matrixTable = document.getElementById('matrixTable')
    for(var i = matrixTable.children.length - 1; i >= 0; --i)
      matrixTable.children[i].remove(0)
    matrixTable.appendChild(app.matrixToTbody(matrix))
  } else if(event.target.id == 'answer')
    alert(app.getDeterminant(app.tbodyToMatrix(document.getElementById('matrixTable').children[0])))
})
