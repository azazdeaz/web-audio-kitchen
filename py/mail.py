try:
  self.request.get("email_address")
except:
  print("nem megy")
else:
  print("megy")