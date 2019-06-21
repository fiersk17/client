// Copyright 2019 Keybase, Inc. All rights reserved. Use of
// this source code is governed by the included BSD license.

package home

import (
	"github.com/keybase/client/go/libkb"
	"github.com/keybase/client/go/phonenumbers"
	keybase1 "github.com/keybase/client/go/protocol/keybase1"
)

func getUserDataForItem(mctx libkb.MetaContext, item *keybase1.HomeScreenItem) error {
	todoItem := item.Data.Todo()
	// We can't do todoItem.T() here because it would return an error because
	// variants we are getting from the server are incomplete. We are expected
	// to fill them here in this function.
	todoType := todoItem.T__
	switch todoType {
	case keybase1.HomeScreenTodoType_VERIFY_ALL_PHONE_NUMBER:
		numbers, err := phonenumbers.GetPhoneNumbers(mctx)
		if err != nil {
			return err
		}
		for _, v := range numbers {
			if !v.Superseded && !v.Verified {
				item.Data.Todo__.VerifyAllPhoneNumber__ = &v.PhoneNumber
				break
			}
		}
	case keybase1.HomeScreenTodoType_VERIFY_ALL_EMAIL:
		emails, err := libkb.LoadUserEmails(mctx)
		if err != nil {
			return err
		}
		for _, v := range emails {
			if !v.IsVerified {
				item.Data.Todo__.VerifyAllEmail__ = &v.Email
				break
			}
		}
	case keybase1.HomeScreenTodoType_LEGACY_EMAIL_VISIBILITY:
		emails, err := libkb.LoadUserEmails(mctx)
		if err != nil {
			return err
		}
		for _, v := range emails {
			if v.IsPrimary {
				item.Data.Todo__.LegacyEmailVisibility__ = &v.Email
				break
			}
		}
	}

	return nil
}

// getUserData will fetch additional data for some TODO items, like unverified
// phone numbers for "verify phone number" TODO or unverified emails for
// "verify email" TODO.
func getUserData(mctx libkb.MetaContext, home *keybase1.HomeScreen) (err error) {
	defer mctx.TraceTimed("Home#getUserData", func() error { return err })()
	for i := range home.Items {
		v := &home.Items[i]
		typ, err := v.Data.T()
		if err != nil {
			return err
		}
		if typ != keybase1.HomeScreenItemType_TODO {
			continue
		}
		err = getUserDataForItem(mctx, v)
		if err != nil {
			return err
		}
	}
	return nil
}
