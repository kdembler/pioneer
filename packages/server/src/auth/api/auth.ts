import { pick } from 'lodash'
import { arg, intArg, mutationField, nonNull, stringArg } from 'nexus'
import * as Yup from 'yup'

import { verifySignature } from '@/auth/model/signature'
import { createAuthToken, createEmailToken } from '@/auth/model/token'
import { Context } from '@/common/api'
import { PIONEER_URL } from '@/common/config'
import { renderPioneerEmail } from '@/common/email-templates/pioneer-email'
import { createEmailProvider } from '@/common/utils/email'

const emailProvider = createEmailProvider()

interface SignInArgs {
  memberId: number
  signature: string
  timestamp: number
}

export const signin = mutationField('signin', {
  type: 'String',

  args: {
    memberId: nonNull(intArg()),
    signature: nonNull(stringArg()),
    timestamp: nonNull(arg({ type: 'BigInt' })),
  },

  resolve: async (_, args: SignInArgs): Promise<string | null> => {
    const verification = await verifySignature(args.signature, args.memberId, args.timestamp)
    if (verification !== 'VALID') {
      return null
    }

    return createAuthToken(args.memberId)
  },
})

export interface SignUpArgs extends SignInArgs {
  name: string
  email?: string
}

export const signup = mutationField('signup', {
  type: 'String',

  args: {
    memberId: nonNull(intArg()),
    name: nonNull(stringArg()),
    email: stringArg(),
    signature: nonNull(stringArg()),
    timestamp: nonNull(arg({ type: 'BigInt' })),
  },

  resolve: async (_, args: SignUpArgs, { req, prisma }: Context): Promise<string | null> => {
    const verification = await verifySignature(args.signature, args.memberId, args.timestamp)
    if (verification !== 'VALID') {
      return null
    }

    await prisma.member.create({ data: { id: args.memberId, name: args.name } })

    if (args.email && (await Yup.string().email().isValid(args.email))) {
      const token = createEmailToken(pick(args as Required<SignUpArgs>, 'email', 'memberId'))
      const verificationUrl = `${req?.headers.referer ?? PIONEER_URL}/#/?verify-email=${token}`

      await emailProvider.sendEmail({
        to: args.email,
        subject: 'Confirm your email for Pioneer',
        html: renderPioneerEmail({
          memberHandle: args.name,
          summary: 'Confirm your email for Pioneer',
          text: 'Please use the link below to confirm your email address for Pioneer notifications',
          button: {
            label: 'Confirm email',
            href: verificationUrl,
          },
        }),
      })
    }

    return createAuthToken(args.memberId)
  },
})