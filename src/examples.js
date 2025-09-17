export const exampleCode = {
    'basics-variables': 'name = "Rivor"\nage = 1\nprint("Name:", name)\nprint("Age:", age)',
    'basics-operators': '# Arithmetic Operators\nadd = 15 + 5\nsub = 15 - 5\nmult = 15 * 5\nprint("Addition:", add)\nprint("Subtraction:", sub)\nprint("Multiplication:", mult)\n\n# Bitwise Operators\na = 10 # Binary: 1010\nb = 4  # Binary: 0100\nbitwise_and = a & b # Result: 0 (Binary: 0000)\nbitwise_or = a | b  # Result: 14 (Binary: 1110)\nprint("Bitwise AND:", bitwise_and)\nprint("Bitwise OR:", bitwise_or)\n\n# Comparison Operators\na = 10\nb = 20\nis_equal = a == b\nis_greater = a > b\nprint("Is a equal to b?", is_equal)\nprint("Is a greater than b?", is_greater)\n\n# Logical Operators\naccess_granted = True\nif not access_granted:\n  print("Access Denied.")\nelse:\n  print("Welcome!")',
    'basics-conditionals': 'temperature = 25\n\nif temperature > 30:\n  print("It is a hot day!")\nelif temperature > 20:\n  print("It is a pleasant day.")\nelse:\n  print("It might be cold.")',
    'basics-for-loops': '# This loop prints numbers from 0 to 4\nfor i in range(5):\n  print("Current number:", i)',
    'basics-while-loops': 'count = 0\n\nwhile count < 5:\n  print("Count is:", count)\n  count = count + 1 # Increment the count',
    'basics-functions': 'def greet(name):\n  return "Hello, " + name + "!"\n\nmessage = greet("Rivor")\nprint(message)',
    //add more examples for other topics later
};