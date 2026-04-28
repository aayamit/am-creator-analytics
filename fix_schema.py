#!/usr/bin/env python3
"""Fix Prisma schema - add missing relation fields"""

with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

# ============================================
# 1. Add relations to Contract model (before closing brace)
# ============================================
old_contract_closing = '  @@index([expiresAt])\n}'
new_contract_closing = '''  @@index([expiresAt])
  
  // Relations
  negotiations     ContractNegotiation[]  @relation("ContractNegotiations")
  tickets          SupportTicket[]        @relation("ContractTickets")
}'''
content = content.replace(old_contract_closing, new_contract_closing)

# ============================================
# 2. Add relation name to ContractNegotiation's contract field
# ============================================
content = content.replace(
    'contract    Contract  @relation(fields: [contractId], references: [id], onDelete: Cascade)',
    'contract    Contract  @relation("ContractNegotiations", fields: [contractId], references: [id], onDelete: Cascade)'
)

# ============================================
# 3. Add relation name to SupportTicket's contract field
# ============================================
content = content.replace(
    'contract     Contract?    @relation(fields: [contractId], references: [id], onDelete: SetNull)',
    'contract     Contract?    @relation("ContractTickets", fields: [contractId], references: [id], onDelete: SetNull)'
)

# ============================================
# 4. Add relations to User model
# ============================================
old_user_closing = '  @@index([email])\n  @@index([role])\n}'
new_user_closing = '''  @@index([email])
  @@index([role])
  
  // Contract relations
  negotiationsCreated ContractNegotiation[]  @relation("NegotiationCreator")
  ticketsCreated      SupportTicket[]        @relation("TicketCreator")
  ticketsAssigned     SupportTicket[]        @relation("TicketAssignee")
}'''
content = content.replace(old_user_closing, new_user_closing)

# ============================================
# Write the fixed schema
# ============================================
with open('prisma/schema.prisma', 'w') as f:
    f.write(content)

print("✅ Schema fixed successfully!")
